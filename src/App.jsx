import { Route, Routes } from "react-router"
import { BudgetPage } from "./pages/dashboard/BudgetPage"
import SigninPage from "./pages/auth/SigninPage"
import SignupPage from "./pages/auth/SignupPage"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { DashboardPage } from "./pages/dashboard/DashboardPage"
import { WalletsPage } from "./pages/dashboard/WalletsPage"
import { CardsPage } from "./pages/dashboard/CardsPage"
import { TransactionsPage } from "./pages/dashboard/TransactionsPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/budget" element={<BudgetPage />} />
          <Route path="/dashboard/wallets" element={<WalletsPage />} />
          <Route path="/dashboard/cards" element={<CardsPage />} />
          <Route path="/dashboard/transactions" element={<TransactionsPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
