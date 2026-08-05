import { useState, useCallback, useMemo } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth, AuthContext, readToken, setSession, persistToken } from './auth-context.js'
import { login as loginApi, register as registerApi } from './api'

// Seeds token + axios header synchronously from storage (no effect needed).
const useInitialToken = () => {
  const [token, setToken] = useState(() => {
    const stored = readToken()
    if (stored) {
      persistToken(stored)
    }
    return stored
  })
  return [token, setToken]
}

export function AuthProvider({ children }) {
  const [token, setToken] = useInitialToken()

  const login = useCallback(async (payload) => {
    const { data } = await loginApi(payload)
    // Backend returns { data: { token, expires_in } }
    const { token: jwt, expires_in } = data
    persistToken(jwt, expires_in)
    setToken(jwt)
  }, [setToken])

  const register = useCallback(async (payload) => {
    const res = await registerApi(payload)
    return res
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setToken(null)
  }, [setToken])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isLoading: false,
      login,
      register,
      logout,
    }),
    [token, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const to = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={to} replace />
  }

  return children
}
