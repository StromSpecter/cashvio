import { Route, Routes, Navigate } from "react-router"
import { Toaster } from "./lib/toast.jsx"
import SigninPage from "./pages/auth/SigninPage"
import SignupPage from "./pages/auth/SignupPage"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { DashboardPage } from "./pages/dashboard/DashboardPage"
import { WalletsPage } from "./pages/dashboard/WalletsPage"
import { CardsPage } from "./pages/dashboard/CardsPage"
import { TransactionsPage } from "./pages/dashboard/TransactionsPage"
import { TransfersPage } from "./pages/dashboard/TransfersPage"
import { RequireAuth, RequirePremium, GuestRoute } from "./lib/auth.jsx"
import LandingPage from "./pages/landing/LandingPage"
import { CashPage } from "./pages/dashboard/CashPage.jsx"
import { InvestmentsPage } from "./pages/dashboard/InvestmentsPage.jsx"
import PortfolioPage from "./pages/dashboard/PortfolioPage.jsx"
import ProfilePage from "./pages/dashboard/ProfilePage.jsx"
import SettingsPage from "./pages/dashboard/SettingsPage.jsx"
import DetailSahamIDXPage from "./pages/dashboard/DetailSahamIDXPage.jsx"

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
          <Route path="/dashboard/cash" element={<CashPage />} />
          <Route path="/dashboard/wallets" element={<WalletsPage />} />
          <Route path="/dashboard/cards" element={<CardsPage />} />
          <Route path="/dashboard/transactions" element={<TransactionsPage />} />
          <Route path="/dashboard/transfers" element={<TransfersPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route
            path="/dashboard/investments"
            element={
              <RequirePremium>
                <InvestmentsPage />
              </RequirePremium>
            }
          />
          <Route
            path="/dashboard/portfolio"
            element={
              <RequirePremium>
                <PortfolioPage />
              </RequirePremium>
            }
          />
          <Route 
            path="/dashboard/investments/:symbol"
            element={
              <RequirePremium>
                <DetailSahamIDXPage />
              </RequirePremium>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  )
}

export default App
