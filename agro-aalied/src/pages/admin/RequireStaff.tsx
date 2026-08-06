import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

/** Wraps admin routes. Anyone signed in through Supabase Auth counts as staff. */
export default function RequireStaff({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (checking) return <p className="p-8 text-leaf-500">Checking your session…</p>
  if (!session) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
