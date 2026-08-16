import { createContext, useContext } from 'react'

export const InvestmentContext = createContext({
  investments: [],
  addInvestment: () => {},
  updateInvestment: () => {},
  deleteInvestment: () => {},
  addLot: () => {},
  deleteLot: () => {},
})

// Hook (pure JS file - no component so react-refresh only-export rule is N/A).
export const useInvestments = () => useContext(InvestmentContext)