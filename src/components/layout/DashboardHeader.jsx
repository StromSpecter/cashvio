import { useState } from 'react'
import { Menu, Search, Bell, ChevronDown, ArrowUpFromLine, ArrowDownToLine, Settings, User, LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useTheme } from '../../lib/theme.jsx'
import { useAuth } from '../../lib/auth-context.js'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from '../ui/dropdown'

export function DashboardHeader({ onMenuClick }) {
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const name = user?.name || 'User'
  const email = user?.email || ''
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
  const [notifications] = useState([
    { id: 1, title: 'New deposit received', desc: '+Rp2.450.000 · Just now' },
    { id: 2, title: 'Withdrawal approved', desc: '-Rp120.000 · 2h ago' },
    { id: 3, title: 'Security alert', desc: 'New device sign-in · 1d ago' },
  ])

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40">
      <div className="flex h-14 items-center gap-4 px-6">
        <button
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden md:block flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search transactions, wallets..."
              className="h-9 pl-8"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="size-5" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" aria-label="Add funds">
            <ArrowDownToLine className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Withdraw">
            <ArrowUpFromLine className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-5" />
                <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
              </Button>
            </DropdownTrigger>
            <DropdownContent align="end" className="w-72">
              <DropdownLabel>Notifications</DropdownLabel>
              {notifications.map((n) => (
                <DropdownItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                  <span className="font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.desc}</span>
                </DropdownItem>
              ))}
              <DropdownSeparator />
              <DropdownItem className="text-center text-muted-foreground">View all</DropdownItem>
            </DropdownContent>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent"
                aria-label="Account menu"
              >
                <Avatar className="size-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>{initials || 'U'}</AvatarFallback>
                </Avatar>
                <ChevronDown className="hidden sm:block size-4 text-muted-foreground" />
              </button>
            </DropdownTrigger>
            <DropdownContent align="end" className="w-56">
              <DropdownLabel>
                <span className="block font-semibold text-foreground">{name}</span>
                <span className="text-xs font-normal">{email}</span>
              </DropdownLabel>
              <DropdownSeparator />
              <DropdownItem>
                <User className="size-4" /> Profile
              </DropdownItem>
              <DropdownItem>
                <Settings className="size-4" /> Settings
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem className="text-destructive focus:text-destructive" onClick={() => logout()}>
                <LogOut className="size-4" /> Log out
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
