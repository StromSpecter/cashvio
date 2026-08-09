import { Route, Routes, Navigate } from "react-router"
import { Toaster } from "./lib/toast.jsx"
import { BudgetPage } from "./pages/dashboard/BudgetPage"
import SigninPage from "./pages/auth/SigninPage"
import SignupPage from "./pages/auth/SignupPage"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { DashboardPage } from "./pages/dashboard/DashboardPage"
import { WalletsPage } from "./pages/dashboard/WalletsPage"
import { CardsPage } from "./pages/dashboard/CardsPage"
import { TransactionsPage } from "./pages/dashboard/TransactionsPage"
import { TransfersPage } from "./pages/dashboard/TransfersPage"
import { RequireAuth, GuestRoute } from "./lib/auth.jsx"

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route
          path="/signin"
          element={
            <GuestRoute>
              <SigninPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />

        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/budget" element={<BudgetPage />} />
          <Route path="/dashboard/wallets" element={<WalletsPage />} />
          <Route path="/dashboard/cards" element={<CardsPage />} />
          <Route path="/dashboard/transactions" element={<TransactionsPage />} />
          <Route path="/dashboard/transfers" element={<TransfersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  )
}

export default App
