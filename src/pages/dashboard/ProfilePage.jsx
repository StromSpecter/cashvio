import { useState } from 'react'
import { Loader2, Crown } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { useAuth } from '../../lib/auth-context.js'
import { updateUser } from '../../lib/api'
import { toast } from '../../lib/toast.js'

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ProfilePage() {
  const { user, isPremium, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateUser(user.id, { name, email })
      toast.success('Profil diperbarui')
      await refreshUser()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Informasi akun dan identitas kamu.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <Avatar className="size-20">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="text-2xl">{initials || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg font-semibold">{user?.name}</p>
                {isPremium && <Crown className="size-4 text-amber-500" />}
              </div>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant={isPremium ? 'warning' : 'secondary'}>
                {isPremium ? 'Premium' : 'Free'}
              </Badge>
              {isPremium && user?.premium_expires_at && (
                <span className="text-xs text-muted-foreground">
                  sampai {formatDate(user.premium_expires_at)}
                </span>
              )}
            </div>
            <div className="w-full space-y-1 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member sejak</span>
                <span>{formatDate(user?.created_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit profil</CardTitle>
            <CardDescription>Nama dan email yang ditampilkan di akun kamu.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Nama</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}