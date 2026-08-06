import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Centralized endpoint namespace constants.
// Change paths here only — everything else references these.
export const API = {
  AUTH: '/api/v1/auth',
  USER: '/api/v1/users',
  CARD: '/api/v1/cards',
  WALLET: '/api/v1/wallets',
  TRANSACTION: '/api/v1/transactions',
  HEALTH: '/health',
}

export const ENDPOINTS = {
  // Auth
  REGISTER: `${API.AUTH}/register`,
  LOGIN: `${API.AUTH}/login`,

  // Users
  USERS: API.USER,
  ME: `${API.USER}/me`,
  USER: (id) => `${API.USER}/${id}`,

  // Cards
  CARDS: API.CARD,
  CARD: (id) => `${API.CARD}/${id}`,

  // Wallets
  WALLETS: API.WALLET,
  WALLET: (id) => `${API.WALLET}/${id}`,

  // Transactions
  TRANSACTIONS: API.TRANSACTION,
  TRANSACTION: (id) => `${API.TRANSACTION}/${id}`,

  // Health
  HEALTH: API.HEALTH,
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to outgoing requests.
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

// Unwrap backend envelope `{ data: ... }` when present, and normalize errors.
api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data
    ) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// --- Auth ---
export const register = (payload) => api.post(ENDPOINTS.REGISTER, payload)
export const login = (payload) => api.post(ENDPOINTS.LOGIN, payload)

// --- Users ---
export const getMe = () => api.get(ENDPOINTS.ME)
export const getUsers = (params) => api.get(ENDPOINTS.USERS, { params })
export const getUser = (id) => api.get(ENDPOINTS.USER(id))
export const createUser = (payload) => api.post(ENDPOINTS.USERS, payload)
export const updateUser = (id, payload) => api.put(ENDPOINTS.USER(id), payload)
export const deleteUser = (id) => api.delete(ENDPOINTS.USER(id))

// --- Cards ---
export const getCards = (params) => api.get(ENDPOINTS.CARDS, { params })
export const getCard = (id) => api.get(ENDPOINTS.CARD(id))
export const createCard = (payload) => api.post(ENDPOINTS.CARDS, payload)
export const updateCard = (id, payload) => api.put(ENDPOINTS.CARD(id), payload)
export const deleteCard = (id) => api.delete(ENDPOINTS.CARD(id))

// --- Wallets ---
export const getWallets = (params) => api.get(ENDPOINTS.WALLETS, { params })
export const getWallet = (id) => api.get(ENDPOINTS.WALLET(id))
export const createWallet = (payload) => api.post(ENDPOINTS.WALLETS, payload)
export const updateWallet = (id, payload) => api.put(ENDPOINTS.WALLET(id), payload)
export const deleteWallet = (id) => api.delete(ENDPOINTS.WALLET(id))

// --- Transactions ---
export const getTransactions = (params) => api.get(ENDPOINTS.TRANSACTIONS, { params })
export const getTransaction = (id) => api.get(ENDPOINTS.TRANSACTION(id))
export const createTransaction = (payload) => api.post(ENDPOINTS.TRANSACTIONS, payload)
export const updateTransaction = (id, payload) => api.put(ENDPOINTS.TRANSACTION(id), payload)
export const deleteTransaction = (id) => api.delete(ENDPOINTS.TRANSACTION(id))

// --- Health ---
export const health = () => api.get(ENDPOINTS.HEALTH)

export default api
