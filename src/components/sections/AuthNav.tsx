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

    const linkBaseClass = "inline-flex min-h-11 w-full sm:w-auto items-center justify-center px-3 py-2 border rounded-lg font-semibold text-[0.78rem] transition-colors duration-150"
    const loginClass = `${linkBaseClass} border-arcade-border-bright text-arcade-text bg-arcade-surface hover:border-arcade-purple-bright hover:bg-arcade-surface-raised`
    const signupClass = `${linkBaseClass} border-arcade-purple-bright text-white bg-arcade-purple hover:bg-arcade-purple-bright`

    if (user) {
        return (
            <li className="col-span-2 sm:col-span-1">
                <a href="/profile" className={loginClass}>Profile</a>
            </li>
        )
    }

    return (
        <>
            <li>
                <a href="/login" className={loginClass}>Sign in</a>
            </li>
            <li>
                <a href="/signup" className={signupClass}>Join</a>
            </li>
        </>
    )
}
