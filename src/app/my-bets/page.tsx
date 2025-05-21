'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Match = {
    id: number
    home_team_name: string
    away_team_name: string
    start_time: string
}

type Bet = {
    id: number
    match_id: number
    coef: number
    amount: number
    team_name: string
    success: boolean | null
    match: Match | null
}

export default function MyBetsPage() {
    const [bets, setBets] = useState<Bet[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBets = async () => {
            const supabase = createClient()

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError || !user) {
                setError('Потрібна авторизація')
                setLoading(false)
                return
            }

            const { data: betsData, error: betsError } = await supabase
                .from('bets')
                .select('id, match_id, coef, amount, team_name, success')
                .eq('user_id', user.id)
                .order('id', { ascending: false })

            if (betsError || !betsData) {
                setError('Не вдалося завантажити ставки')
                setLoading(false)
                return
            }

            if (betsData.length === 0) {
                setBets([])
                setLoading(false)
                return
            }

            const matchIds = betsData.map(bet => bet.match_id)

            const { data: matchesData, error: matchesError } = await supabase
                .from('matches')
                .select('id, home_team_name, away_team_name, start_time')
                .in('id', matchIds)

            if (matchesError || !matchesData) {
                setError('Failed to load matches')
                setLoading(false)
                return
            }

            const betsWithMatches = betsData.map(bet => ({
                ...bet,
                match: matchesData.find(m => m.id === bet.match_id) ?? null,
            }))

            setBets(betsWithMatches)
            setLoading(false)
        }

        fetchBets()
    }, [])

    if (loading) {
        return <div className="text-center text-white p-10">Loading bets...</div>
    }

    if (error) {
        return <div className="text-center text-red-500 p-10">{error}</div>
    }

    if (bets.length === 0) {
        return <div className="text-center text-white p-10">You have no bets yet.</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">My bets</h1>
            <ul className="space-y-4">
                {bets.map(bet => {
                    let bgColor = 'bg-gray-900'
                    if (bet.success === true) bgColor = 'bg-green-900'
                    if (bet.success === false) bgColor = 'bg-red-900'

                    return (
                        <li
                            key={bet.id}
                            className={`border border-gray-700 rounded-lg p-4 shadow-md ${bgColor}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-lg font-semibold flex gap-1">
                                    {bet.match ? (
                                        <>
                                            <span
                                                className={
                                                    bet.team_name === bet.match.home_team_name
                                                        ? 'text-green-400'
                                                        : 'text-white'
                                                }
                                            >
                                                {bet.match.home_team_name}
                                            </span>
                                            <span className="text-gray-400">vs</span>
                                            <span
                                                className={
                                                    bet.team_name === bet.match.away_team_name
                                                        ? 'text-orange-400'
                                                        : 'text-white'
                                                }
                                            >
                                                {bet.match.away_team_name}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="italic text-gray-400">No match found</span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-400">
                                    {bet.match ? new Date(bet.match.start_time).toLocaleString() : ''}
                                </div>
                            </div>

                            <div className="flex justify-between text-orange-400 font-semibold text-lg">
                                <span>Bet amount: {bet.amount} ₴</span>
                                <span>Coefficient: {bet.coef}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
