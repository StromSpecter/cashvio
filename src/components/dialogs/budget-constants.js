import {
  Home,
  ShoppingBasket,
  Utensils,
  Car,
  Globe,
  PiggyBank,
  Wallet,
  Heart,
  Smartphone,
  GraduationCap,
  Plane,
  Zap,
} from 'lucide-react'

export const COLOR_OPTIONS = [
  { value: 1, css: 'var(--color-chart-1)' },
  { value: 2, css: 'var(--color-chart-2)' },
  { value: 3, css: 'var(--color-chart-3)' },
  { value: 4, css: 'var(--color-chart-4)' },
]

export const ICON_OPTIONS = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBasket },
  { value: 'utensils', label: 'Food', icon: Utensils },
  { value: 'car', label: 'Transport', icon: Car },
  { value: 'globe', label: 'Lifestyle', icon: Globe },
  { value: 'piggy', label: 'Savings', icon: PiggyBank },
  { value: 'wallet', label: 'Wallet', icon: Wallet },
  { value: 'heart', label: 'Health', icon: Heart },
  { value: 'smartphone', label: 'Tech', icon: Smartphone },
  { value: 'graduation', label: 'Education', icon: GraduationCap },
  { value: 'plane', label: 'Travel', icon: Plane },
  { value: 'zap', label: 'Fun', icon: Zap },
]

export const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map((o) => [o.value, o.icon]))

export const colorVar = (n) => `var(--color-chart-${n})`
