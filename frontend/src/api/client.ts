const API_BASE_URL = 'http://localhost:5000';

export interface User {
  id: string;
  userId: number;
  username: string;
  first_name: string;
  last_name: string;
  addedAt: string;
  balances?: Balance[];
}

export interface UserResponse {
  user: User;
  balances: Balance[];
}

export interface Balance {
  type: string;
  balance: number;
}

export interface Auction {
  id: string;
  status: 'active' | 'ended';
  roundCount: number;
  currentRound: number;
  roundDuration: number;
  roundStartTime: string;
  roundEndTime: string;
  giftCollectionId: string;
  supplyCount: number;
  addedAt: string;
  endedAt: string | null;
}

export interface Bet {
  id: string;
  userId: number;
  amount: number;
  round: number;
}

export interface AuctionInfo {
  auction: Auction;
  actionBetList: Bet[];
}

export interface Gift {
  id: string;
  giftId: string;
  ownerId: number;
  serialNumber: number;
  addedAt: string;
}

export interface GiftCollection {
  id: string;
  collection: string;
  supplyCount: number;
  addedAt: string;
}

class ApiClient {
  private userId: number | null = null;

  setUserId(userId: number) {
    this.userId = userId;
    localStorage.setItem('userId', userId.toString());
  }

  getUserId(): number | null {
    if (!this.userId) {
      const stored = localStorage.getItem('userId');
      if (stored) {
        this.userId = parseInt(stored, 10);
      }
    }
    return this.userId;
  }

  clearUserId() {
    this.userId = null;
    localStorage.removeItem('userId');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Копируем существующие заголовки из options
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    if (this.userId) {
      headers['user-id'] = this.userId.toString();
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      mode: 'cors',
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      let error: any;
      try {
        error = await response.json();
      } catch {
        error = { message: `HTTP error! status: ${response.status}` };
      }
      
      // Обработка разных форматов ошибок от бекенда
      if (error.error) {
        // Формат: { error: [...] } или { error: "string" }
        if (Array.isArray(error.error)) {
          const errorMessages = error.error.map((e: any) => 
            e.message || `${e.path?.join('.')}: ${e.message || 'Invalid value'}`
          ).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(typeof error.error === 'string' ? error.error : JSON.stringify(error.error));
      }
      
      if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async getUser(): Promise<User> {
    const response = await this.request<UserResponse>('/user');
    // Объединяем user и balances в один объект
    return {
      ...response.user,
      balances: response.balances || [],
    };
  }

  async getAuctions(status: 'active' | 'ended'): Promise<Auction[]> {
    return this.request<Auction[]>(`/auction?status=${status}`);
  }

  async getAuctionInfo(auctionId: string, limit = 50, offset = 0): Promise<AuctionInfo> {
    return this.request<AuctionInfo>(
      `/auction/info?auctionId=${auctionId}&limit=${limit}&offset=${offset}`
    );
  }

  async placeBet(auctionId: string, amount: number, balanceType: string = 'stars'): Promise<void> {
    return this.request<void>('/auction/bet', {
      method: 'POST',
      body: JSON.stringify({ auctionId, amount, balanceType }),
    });
  }

  async getMyGifts(): Promise<Gift[]> {
    return this.request<Gift[]>('/gifts/my');
  }

  async getGiftCollections(): Promise<GiftCollection[]> {
    return this.request<GiftCollection[]>('/gifts/collections');
  }

  async createAuction(
    roundCount: number,
    roundDuration: number,
    supplyCount: number,
    giftCollectionId: string
  ): Promise<Auction> {
    const body = {
      roundCount: Number(roundCount),
      roundDuration: Number(roundDuration),
      supplyCount: Number(supplyCount),
      giftCollectionId: String(giftCollectionId),
    };

    return this.request<Auction>('/auction', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async addBalance(amount: number = 10000, type: string = 'stars'): Promise<Balance> {
    return this.request<Balance>('/user/balance', {
      method: 'POST',
      body: JSON.stringify({ amount, type }),
    });
  }
}

export const apiClient = new ApiClient();
