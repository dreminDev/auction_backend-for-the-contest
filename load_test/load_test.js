/**
 * K6 Load Test - Auction Backend
 * Комплексный нагрузочный тест с постепенным повышением RPS.
 * Эмулирует полный пользовательский сценарий: регистрация, пополнение баланса, создание аукциона, ставки.
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Counter, Rate, Trend } from 'k6/metrics'
import { SharedArray } from 'k6/data'

// Кастомные метрики
const auctionCreated = new Counter('auctions_created')
const betsPlaced = new Counter('bets_placed')
const usersRegistered = new Counter('users_registered')
const failedRequests = new Rate('failed_requests')
const betLatency = new Trend('bet_latency')

// Конфигурация
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000'

// Опции тестирования - нагрузка от 400 до 4000 VU
export const options = {
    stages: [
        { duration: '10s', target: 400 },   // Быстрый старт до 400 VU
        { duration: '20s', target: 800 },   // Повышение до 800 VU
        { duration: '20s', target: 1200 },  // Повышение до 1200 VU
        { duration: '20s', target: 1600 },  // Повышение до 1600 VU
        { duration: '20s', target: 2000 },  // Повышение до 2000 VU
        { duration: '20s', target: 4000 },  // Максимум 4000 VU
        { duration: '10s', target: 0 },     // Завершение
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000'],  // 95% запросов < 3s
        failed_requests: ['rate<0.3'],       // Менее 30% неудачных запросов
    },
}

/**
 * Генерация уникального user-id для каждого VU + итерации
 */
function generateUserId() {
    return __VU * 1000000 + __ITER + Date.now() % 100000
}

/**
 * Создание HTTP заголовков с авторизацией
 */
function getHeaders(userId) {
    return {
        'Content-Type': 'application/json',
        'user-id': String(userId),
    }
}

/**
 * Получение коллекций подарков
 */
function getGiftCollections() {
    const res = http.get(`${BASE_URL}/gifts/collections`)
    
    const success = res.status === 200
    check(res, { 'get collections': (r) => r.status === 200 || r.status < 500 })

    if (success) {
        try {
            const collections = JSON.parse(res.body)
            if (collections && collections.length > 0) {
                return collections[0].id
            }
        } catch (e) {}
    }
    return null
}

/**
 * Регистрация пользователя (выполняется автоматически при первом запросе с user-id)
 */
function registerUser(userId) {
    const res = http.get(`${BASE_URL}/user`, {
        headers: getHeaders(userId),
    })

    const success = check(res, {
        'user registered': (r) => r.status === 200,
    })

    if (success) {
        usersRegistered.add(1)
    } else {
        failedRequests.add(1)
    }

    return success
}

/**
 * Пополнение баланса пользователя
 */
function addBalance(userId, amount) {
    const payload = JSON.stringify({
        amount: amount,
        type: 'stars',
    })

    const res = http.post(`${BASE_URL}/user/balance`, payload, {
        headers: getHeaders(userId),
    })

    const success = check(res, {
        'balance added': (r) => r.status === 200,
    })

    if (!success) {
        failedRequests.add(1)
    }

    return success
}

/**
 * Получение списка активных аукционов
 */
function getActiveAuctions() {
    const res = http.get(`${BASE_URL}/auction?status=active`)

    const success = res.status === 200
    check(res, { 'get auctions': (r) => r.status === 200 || r.status < 500 })

    if (success) {
        try {
            const auctions = JSON.parse(res.body)
            if (auctions && auctions.length > 0) {
                // Возвращаем случайный аукцион из списка
                return auctions[Math.floor(Math.random() * auctions.length)].id
            }
        } catch (e) {}
    }
    return null
}

/**
 * Создание нового аукциона
 */
function createAuction(giftCollectionId) {
    if (!giftCollectionId) return null

    const payload = JSON.stringify({
        roundCount: 5,
        roundDuration: 120000, // 2 минуты - дольше чтобы успели поставить
        supplyCount: 10,
        giftCollectionId: giftCollectionId,
    })

    const res = http.put(`${BASE_URL}/auction`, payload, {
        headers: { 'Content-Type': 'application/json' },
    })

    const success = check(res, {
        'auction created': (r) => r.status === 200,
    })

    if (success) {
        auctionCreated.add(1)
        try {
            const auction = JSON.parse(res.body)
            return auction.id
        } catch (e) {}
    } else {
        failedRequests.add(1)
    }

    return null
}

/**
 * Получение информации об аукционе
 */
function getAuctionInfo(auctionId) {
    if (!auctionId) return false

    const res = http.get(`${BASE_URL}/auction/info?auctionId=${auctionId}&limit=10&offset=0`)

    check(res, {
        'get auction info': (r) => r.status === 200,
    })

    return res.status === 200
}

/**
 * Размещение ставки в аукционе
 */
function placeBet(userId, auctionId, amount) {
    if (!auctionId) return false

    const payload = JSON.stringify({
        auctionId: auctionId,
        amount: amount,
        balanceType: 'stars',
    })

    const startTime = Date.now()
    const res = http.post(`${BASE_URL}/auction/bet`, payload, {
        headers: getHeaders(userId),
    })
    const duration = Date.now() - startTime
    betLatency.add(duration)

    // 204 - успешная ставка, 400 - возможно недостаточно средств или аукцион закончился
    const success = check(res, {
        'bet placed': (r) => r.status === 204 || r.status === 400,
    })

    if (res.status === 204) {
        betsPlaced.add(1)
        return true
    }

    return false
}

/**
 * Получение подарков пользователя
 */
function getUserGifts(userId) {
    const res = http.get(`${BASE_URL}/gifts/my`, {
        headers: getHeaders(userId),
    })

    check(res, {
        'get user gifts': (r) => r.status === 200,
    })

    return res.status === 200
}

/**
 * Setup функция - выполняется один раз перед тестом
 */
export function setup() {
    console.log(`Setting up load test... Base URL: ${BASE_URL}`)
    
    // Получаем коллекцию подарков
    const giftCollectionId = getGiftCollections()
    console.log(`Gift Collection ID: ${giftCollectionId}`)
    
    // Создаем несколько начальных аукционов
    const auctionIds = []
    if (giftCollectionId) {
        for (let i = 0; i < 10; i++) {
            const auctionId = createAuction(giftCollectionId)
            if (auctionId) {
                auctionIds.push(auctionId)
                console.log(`Created auction ${i + 1}: ${auctionId}`)
            }
        }
    } else {
        console.log('WARNING: No gift collections found!')
    }

    return {
        giftCollectionId: giftCollectionId,
        auctionIds: auctionIds,
    }
}

/**
 * Основной сценарий тестирования
 */
export default function (data) {
    const userId = generateUserId()
    const giftCollectionId = data.giftCollectionId

    // 1. Регистрация и настройка пользователя
    group('User Setup', () => {
        registerUser(userId)
        addBalance(userId, 50000) // Больше денег для ставок
    })

    // 2. Получаем аукцион (или создаем новый)
    let auctionId = getActiveAuctions()
    
    // Если аукционов нет - создаем (20% VU создают аукционы)
    if (!auctionId && giftCollectionId && Math.random() < 0.2) {
        auctionId = createAuction(giftCollectionId)
    }

    // 3. Делаем ставки
    if (auctionId) {
        group('Betting', () => {
            for (let i = 0; i < 3; i++) {
                const betAmount = Math.floor(Math.random() * 100) + 10
                placeBet(userId, auctionId, betAmount)
                sleep(0.05)
            }
        })

        // Смотрим информацию об аукционе
        getAuctionInfo(auctionId)
    }

    // 4. Проверяем инвентарь
    getUserGifts(userId)

    // Минимальная пауза
    sleep(Math.random() * 0.3 + 0.1)
}

/**
 * Teardown функция
 */
export function teardown(data) {
    console.log('Load test completed.')
    console.log(`Auctions created in setup: ${data.auctionIds ? data.auctionIds.length : 0}`)
}
