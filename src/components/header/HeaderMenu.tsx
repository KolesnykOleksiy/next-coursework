'use client'

import HeaderButton from "@/components/header/HeaderButton"
import Link from "next/link"
import {usePathname} from 'next/navigation'
import {useEffect, useState} from "react"
import {supabase} from "@/utils/supabase/client"

type Props = {
    onLoginClick?: () => void;
}

export default function HeaderMenu({onLoginClick}: Props) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [balance, setBalance] = useState<number | null>(null)

    useEffect(() => {
        const checkSession = async () => {
            const {data: {session}} = await supabase.auth.getSession()

            if (session) {
                setIsAuthenticated(true)

                const {data: profile, error} = await supabase
                    .from('profiles')
                    .select('total_sum')
                    .eq('id', session.user.id)
                    .single()

                if (!error && profile) {
                    setBalance(profile.total_sum)
                }
            } else {
                setIsAuthenticated(false)
                setBalance(null)
            }
        }

        checkSession()
    }, [])

    return (
        <div className="flex md:flex space-x-4 items-center">
            {isAdmin ? (
                <>
                    <Link href="/admin/confirmed">
                        <HeaderButton>Confirmed</HeaderButton>
                    </Link>
                    <Link href="/admin">
                        <HeaderButton>Create matches</HeaderButton>
                    </Link>
                </>
            ) : (
                <>
                    {isAuthenticated ? (
                        <>
                            <Link href="/my-bets">
                                <HeaderButton>My bets</HeaderButton>
                            </Link>
                            {balance !== null && (
                                <span
                                    className="text-base font-semibold text-white bg-orange-800 px-4 py-2 rounded-md shadow-md border border-orange-300">
    Баланс: <span className="text-black">{balance} ₴</span>
</span>

                            )}
                        </>
                    ) : (
                        <>
                            <HeaderButton onClick={onLoginClick}>Log in</HeaderButton>
                            <Link href="/registration">
                                <HeaderButton>Sign up</HeaderButton>
                            </Link>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
