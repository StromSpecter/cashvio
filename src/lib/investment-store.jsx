import { useState, useMemo, useCallback, useEffect } from 'react'
import { InvestmentContext } from './investment-context'
import { STORAGE_KEY, readStored, getSeedInvestments } from './investments'

export function InvestmentProvider({ children }) {
  const [investments, setInvestments] = useState(() => readStored() || getSeedInvestments())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(investments))
  }, [investments])

  const addInvestment = useCallback(({ lot, ...data }) => {
    const id = String(Date.now())
    const newInvestment = {
      id,
      type: data.type,
      name: data.name,
      ticker: data.ticker,
      current_price: data.current_price,
      buy_date: lot ? lot.buy_date : undefined,
      lots: [
        {
          id: `${id}-lot-0`,
          units: lot?.units || 0,
          buy_price: lot?.buy_price || 0,
          buy_date: lot?.buy_date || '',
        },
      ],
    }
    setInvestments((prev) => [newInvestment, ...prev])
  }, [])

  const updateInvestment = useCallback((id, data) => {
    setInvestments((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              type: data.type,
              name: data.name,
              ticker: data.ticker,
              current_price: data.current_price,
            }
          : i
      )
    )
  }, [])

  const deleteInvestment = useCallback((id) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const addLot = useCallback((assetId, lot) => {
    setInvestments((prev) =>
      prev.map((i) =>
        i.id === assetId
          ? {
              ...i,
              lots: [...i.lots, { ...lot, id: `${i.id}-lot-${Date.now()}` }],
            }
          : i
      )
    )
  }, [])

  const deleteLot = useCallback((assetId, lotId) => {
    setInvestments((prev) =>
      prev.map((i) =>
        i.id === assetId
          ? { ...i, lots: i.lots.filter((lot) => lot.id !== lotId) }
          : i
      )
    )
  }, [])

  const value = useMemo(
    () => ({ investments, addInvestment, updateInvestment, deleteInvestment, addLot, deleteLot }),
    [investments, addInvestment, updateInvestment, deleteInvestment, addLot, deleteLot]
  )

  return <InvestmentContext.Provider value={value}>{children}</InvestmentContext.Provider>
}