import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth, AuthContext, readToken, setSession, persistToken } from './auth-context.js'
import { login as loginApi, register as registerApi, getMe } from './api'

const isPremiumStillValid = (user) => {
  if (user?.role !== 'premium') return false
  if (!user.premium_expires_at) return true
  return new Date(user.premium_expires_at).getTime() > Date.now()
}

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
  const [user, setUser] = useState(null)
  const fetchedTokenRef = useRef(null)

  const fetchUser = useCallback(async () => {
    const { data } = await getMe()
    setUser(data)
    return data
  }, [])

  useEffect(() => {
    if (!token || fetchedTokenRef.current === token) return
    fetchedTokenRef.current = token
    getMe()
      .then(({ data }) => {
        setUser(data)
      })
      .catch(() => {
        setSession(null)
        setToken(null)
      })
  }, [token, setToken])

  const login = useCallback(async (payload) => {
    const { data } = await loginApi(payload)
    // Backend returns { data: { token, expires_in } }
    const { token: jwt, expires_in } = data
    persistToken(jwt, expires_in)
    setToken(jwt)
    await fetchUser()
  }, [setToken, fetchUser])

  const register = useCallback(async (payload) => {
    const res = await registerApi(payload)
    return res
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setToken(null)
    setUser(null)
  }, [setToken])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isPremium: Boolean(user?.role === 'premium' && isPremiumStillValid(user)),
      isLoading: Boolean(token) && !user,
      login,
      register,
      logout,
      refreshUser: fetchUser,
    }),
    [user, token, login, register, logout, fetchUser]
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

export function RequirePremium({ children }) {
  const { isAuthenticated, isPremium, isLoading } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  if (isLoading) {
    return null
  }

  if (!isPremium) {
    return <Navigate to="/dashboard/settings" state={{ from: location }} replace />
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
