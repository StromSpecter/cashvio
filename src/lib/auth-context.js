import { createContext, useContext } from 'react'
import { setAuthToken } from './api'

export const TOKEN_KEY = 'auth_token'

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  register: () => {},
  logout: () => {},
})

// Hook (pure JS file - no component so react-refresh only-export rule is N/A).
export const useAuth = () => useContext(AuthContext)

// Internal: mutate axios headers + localStorage from a token value.
export const setSession = (token) => {
  if (token) {
    setAuthToken(token)
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    setAuthToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('auth_expires_in')
  }
}

// Internal: read seeded token from storage (read once on mount).
export const readToken = () => localStorage.getItem(TOKEN_KEY)

// Internal: persist a freshly-issued JWT (token + expires_in).
export const persistToken = (token, expiresIn) => {
  setAuthToken(token)
  localStorage.setItem(TOKEN_KEY, token)
  if (expiresIn) {
    localStorage.setItem('auth_expires_in', String(expiresIn))
  }
}
