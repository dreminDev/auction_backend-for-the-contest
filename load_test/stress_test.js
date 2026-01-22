/**
 * K6 Stress Test - Auction Backend
 * Стресс-тест для определения максимальной нагрузки приложения.
 * Постепенно увеличивает нагрузку до предела, чтобы найти точку отказа.
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Counter, Rate, Trend } from 'k6/metrics'

// Кастомные метрики
const successfulRequests = new Counter('successful_requests')
const failedRequests = new Counter('failed_requests')
const errorRate = new Rate('error_rate')
const responseTime = new Trend('response_time')

// Метрики по операциям
const registrationTime = new Trend('registration_time')
const balanceTime = new Trend('balance_time')
const auctionListTime = new Trend('auction_list_time')
const betTime = new Trend('bet_time')
const auctionCreateTime = new Trend('auction_create_time')

// Конфигурация
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000'

// Опции стресс-теста - агрессивное повышение нагрузки
export const options = {
    stages: [
        { duration: '20s', target: 50 },    // Быстрый старт до 50 VU
        { duration: '30s', target: 100 },   // Повышение до 100 VU
        { duration: '30s', target: 200 },   // Повышение до 200 VU
        { duration: '30s', target: 300 },   // Повышение до 300 VU
        { duration: '30s', target: 400 },   // Повышение до 400 VU
        { duration: '1m', target: 500 },    // Максимальная нагрузка 500 VU
        { duration: '30s', target: 500 },   // Удержание максимума
        { duration: '20s', target: 0 },     // Резкое снижение
    ],
    thresholds: {
        http_req_duration: ['p(99)<5000'],   // 99% запросов < 5s (мягкий порог для стресс-теста)
        error_rate: ['rate<0.5'],            // Менее 50% ошибок (для стресс-теста допустимо больше)
    },
}

/**
 * Генерация уникального user-id
 */
function generateUserId() {
    return __VU * 1000000 + __ITER + Date.now() % 100000
}

/**
 * Создание HTTP заголовков
 */
function getHeaders(userId) {
    return {
        'Content-Type': 'application/json',
        'user-id': String(userId),
    }
}

/**
 * Обертка для HTTP запросов с метриками
 */
function trackedRequest(name, requestFn, metricTrend) {
    const startTime = Date.now()
    const res = requestFn()
    const duration = Date.now() - startTime

    responseTime.add(duration)
    if (metricTrend) {
        metricTrend.add(duration)
    }

    const success = res.status >= 200 && res.status < 400

    if (success) {
        successfulRequests.add(1)
        errorRate.add(0)
    } else {
        failedRequests.add(1)
        errorRate.add(1)
    }

    return { res, success, duration }
}

/**
 * Получение коллекций подарков
 */
function getGiftCollections() {
    const { res, success } = trackedRequest('get_collections', () => {
        return http.get(`${BASE_URL}/gifts/collections`)
    })

    if (success && res.body) {
        try {
            const collections = JSON.parse(res.body)
            if (collections && collections.length > 0) {
                return collections[0].id
            }
        } catch (e) {
            // Игнорируем ошибки парсинга
        }
    }
    return null
}

/**
 * Регистрация пользователя
 */
function registerUser(userId) {
    const { success } = trackedRequest('register', () => {
        return http.get(`${BASE_URL}/user`, {
            headers: getHeaders(userId),
        })
    }, registrationTime)

    return success
}

/**
 * Пополнение баланса
 */
function addBalance(userId, amount) {
    const payload = JSON.stringify({
        amount: amount,
        type: 'stars',
    })

    const { success } = trackedRequest('add_balance', () => {
        return http.post(`${BASE_URL}/user/balance`, payload, {
            headers: getHeaders(userId),
        })
    }, balanceTime)

    return success
}

/**
 * Получение активных аукционов
 */
function getActiveAuctions() {
    const { res, success } = trackedRequest('get_auctions', () => {
        return http.get(`${BASE_URL}/auction?status=active`)
    }, auctionListTime)

    if (success && res.body) {
        try {
            const auctions = JSON.parse(res.body)
            if (auctions && auctions.length > 0) {
                return auctions[Math.floor(Math.random() * auctions.length)].id
            }
        } catch (e) {
            // Игнорируем ошибки парсинга
        }
    }
    return null
}

/**
 * Создание аукциона
 */
function createAuction(giftCollectionId) {
    const payload = JSON.stringify({
        roundCount: 2,
        roundDuration: 30000, // 30 секунд для быстрого теста
        supplyCount: 3,
        giftCollectionId: giftCollectionId,
    })

    const { res, success } = trackedRequest('create_auction', () => {
        return http.put(`${BASE_URL}/auction`, payload, {
            headers: { 'Content-Type': 'application/json' },
        })
    }, auctionCreateTime)

    if (success && res.body) {
        try {
            const auction = JSON.parse(res.body)
            return auction.id
        } catch (e) {
            // Игнорируем ошибки парсинга
        }
    }
    return null
}

/**
 * Размещение ставки
 */
function placeBet(userId, auctionId, amount) {
    const payload = JSON.stringify({
        auctionId: auctionId,
        amount: amount,
        balanceType: 'stars',
    })

    const { res } = trackedRequest('place_bet', () => {
        return http.post(`${BASE_URL}/auction/bet`, payload, {
            headers: getHeaders(userId),
        })
    }, betTime)

    // 204 - успех, 400 - ожидаемая ошибка (недостаточно средств и т.д.)
    return res.status === 204
}

/**
 * Получение информации об аукционе
 */
function getAuctionInfo(auctionId) {
    const { success } = trackedRequest('get_auction_info', () => {
        return http.get(`${BASE_URL}/auction/info?auctionId=${auctionId}&limit=10&offset=0`)
    })

    return success
}

/**
 * Получение подарков пользователя
 */
function getUserGifts(userId) {
    const { success } = trackedRequest('get_gifts', () => {
        return http.get(`${BASE_URL}/gifts/my`, {
            headers: getHeaders(userId),
        })
    })

    return success
}

/**
 * Setup функция
 */
export function setup() {
    console.log('Starting stress test...')
    console.log(`Target URL: ${BASE_URL}`)
    
    const giftCollectionId = getGiftCollections()
    console.log(`Gift Collection ID: ${giftCollectionId}`)

    // Создаем несколько аукционов для стресс-теста
    const auctionIds = []
    if (giftCollectionId) {
        for (let i = 0; i < 5; i++) {
            const auctionId = createAuction(giftCollectionId)
            if (auctionId) {
                auctionIds.push(auctionId)
                console.log(`Created auction ${i + 1}: ${auctionId}`)
            }
        }
    }

    return {
        giftCollectionId: giftCollectionId,
        auctionIds: auctionIds,
    }
}

/**
 * Основной сценарий стресс-теста
 */
export default function (data) {
    const userId = generateUserId()
    const giftCollectionId = data.giftCollectionId

    // Сценарий 1: Быстрая регистрация и ставка (60% пользователей)
    if (Math.random() < 0.6) {
        group('Quick Bet Scenario', () => {
            registerUser(userId)
            addBalance(userId, 5000)
            
            const auctionId = getActiveAuctions()
            if (auctionId) {
                placeBet(userId, auctionId, Math.floor(Math.random() * 50) + 10)
            }
        })
    }
    // Сценарий 2: Просмотр аукционов (30% пользователей)
    else if (Math.random() < 0.9) {
        group('Browse Scenario', () => {
            getActiveAuctions()
            
            const auctionId = getActiveAuctions()
            if (auctionId) {
                getAuctionInfo(auctionId)
            }
            
            getGiftCollections()
        })
    }
    // Сценарий 3: Создание аукциона (10% пользователей)
    else {
        group('Create Auction Scenario', () => {
            registerUser(userId)
            
            if (giftCollectionId) {
                createAuction(giftCollectionId)
            }
        })
    }

    // Минимальная пауза для агрессивного стресс-теста
    sleep(Math.random() * 0.5 + 0.1) // 0.1-0.6 секунды
}

/**
 * Интенсивный сценарий - только ставки
 */
export function intensiveBetting(data) {
    const userId = generateUserId()

    registerUser(userId)
    addBalance(userId, 50000)

    // Делаем множество ставок подряд
    for (let i = 0; i < 10; i++) {
        const auctionId = getActiveAuctions()
        if (auctionId) {
            placeBet(userId, auctionId, Math.floor(Math.random() * 100) + 10)
        }
        sleep(0.05) // Минимальная задержка
    }
}

/**
 * Teardown функция
 */
export function teardown(data) {
    console.log('Stress test completed.')
    console.log('Check the results for breaking point analysis.')
}

/**
 * Обработка результатов теста
 */
export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `stress_test_results_${timestamp}.json`

    // Генерируем отчет
    const report = {
        timestamp: new Date().toISOString(),
        testType: 'stress_test',
        summary: {
            totalRequests: data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 0,
            successfulRequests: data.metrics.successful_requests ? data.metrics.successful_requests.values.count : 0,
            failedRequests: data.metrics.failed_requests ? data.metrics.failed_requests.values.count : 0,
            errorRate: data.metrics.error_rate ? data.metrics.error_rate.values.rate : 0,
        },
        responseTime: {
            avg: data.metrics.http_req_duration ? data.metrics.http_req_duration.values.avg : 0,
            min: data.metrics.http_req_duration ? data.metrics.http_req_duration.values.min : 0,
            max: data.metrics.http_req_duration ? data.metrics.http_req_duration.values.max : 0,
            p90: data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(90)'] : 0,
            p95: data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(95)'] : 0,
            p99: data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(99)'] : 0,
        },
        operationTimes: {
            registration: data.metrics.registration_time ? data.metrics.registration_time.values.avg : 0,
            balance: data.metrics.balance_time ? data.metrics.balance_time.values.avg : 0,
            auctionList: data.metrics.auction_list_time ? data.metrics.auction_list_time.values.avg : 0,
            bet: data.metrics.bet_time ? data.metrics.bet_time.values.avg : 0,
            auctionCreate: data.metrics.auction_create_time ? data.metrics.auction_create_time.values.avg : 0,
        },
        vus: {
            max: data.metrics.vus_max ? data.metrics.vus_max.values.max : 0,
        },
        thresholds: data.thresholds,
    }

    return {
        [filename]: JSON.stringify(report, null, 2),
        'stdout': textSummary(data),
    }
}

/**
 * Текстовый отчет для консоли
 */
function textSummary(data) {
    const lines = [
        '╔══════════════════════════════════════════════════════════════╗',
        '║            STRESS TEST RESULTS SUMMARY                       ║',
        '╠══════════════════════════════════════════════════════════════╣',
    ]

    if (data.metrics.http_reqs) {
        lines.push(`║ Total Requests:      ${String(data.metrics.http_reqs.values.count).padStart(10)} requests        ║`)
    }
    if (data.metrics.successful_requests) {
        lines.push(`║ Successful:          ${String(data.metrics.successful_requests.values.count).padStart(10)} requests        ║`)
    }
    if (data.metrics.failed_requests) {
        lines.push(`║ Failed:              ${String(data.metrics.failed_requests.values.count).padStart(10)} requests        ║`)
    }
    if (data.metrics.error_rate) {
        lines.push(`║ Error Rate:          ${(data.metrics.error_rate.values.rate * 100).toFixed(2).padStart(10)}%               ║`)
    }
    
    lines.push('╠══════════════════════════════════════════════════════════════╣')
    
    if (data.metrics.http_req_duration) {
        lines.push(`║ Avg Response Time:   ${data.metrics.http_req_duration.values.avg.toFixed(2).padStart(10)} ms              ║`)
        lines.push(`║ P95 Response Time:   ${data.metrics.http_req_duration.values['p(95)'].toFixed(2).padStart(10)} ms              ║`)
        lines.push(`║ P99 Response Time:   ${data.metrics.http_req_duration.values['p(99)'].toFixed(2).padStart(10)} ms              ║`)
        lines.push(`║ Max Response Time:   ${data.metrics.http_req_duration.values.max.toFixed(2).padStart(10)} ms              ║`)
    }
    
    if (data.metrics.vus_max) {
        lines.push(`║ Max VUs:             ${String(data.metrics.vus_max.values.max).padStart(10)}                  ║`)
    }
    
    lines.push('╚══════════════════════════════════════════════════════════════╝')
    
    return lines.join('\n')
}
