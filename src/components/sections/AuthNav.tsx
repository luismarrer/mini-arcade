import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../../lib/supabase"

export default function AuthNav() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (!supabase) return

        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => setUser(session?.user ?? null),
        )

        return () => subscription.unsubscribe()
    }, [])

    if (user) {
        return (
            <li>
                <a href="/profile" className="auth-login">Profile</a>
            </li>
        )
    }

    return (
        <>
            <li>
                <a href="/login" className="auth-login">Sign in</a>
            </li>
            <li>
                <a href="/signup" className="auth-signup">Join</a>
            </li>
        </>
    )
}
