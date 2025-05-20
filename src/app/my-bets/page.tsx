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

            // 1) Запит ставок користувача
            const { data: betsData, error: betsError } = await supabase
                .from('bets')
                .select('id, match_id, coef, amount')
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

            // 2) Запит матчів, які відповідають match_id зі ставок
            const matchIds = betsData.map(bet => bet.match_id)

            const { data: matchesData, error: matchesError } = await supabase
                .from('matches')
                .select('id, home_team_name, away_team_name, start_time')
                .in('id', matchIds)

            if (matchesError || !matchesData) {
                setError('Не вдалося завантажити матчі')
                setLoading(false)
                return
            }

            // Об'єднуємо ставки з матчами
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
        return <div className="text-center text-white p-10">Завантаження ставок...</div>
    }

    if (error) {
        return <div className="text-center text-red-500 p-10">{error}</div>
    }

    if (bets.length === 0) {
        return <div className="text-center text-white p-10">У вас поки немає ставок</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">Мої ставки</h1>
            <ul className="space-y-4">
                {bets.map(bet => (
                    <li
                        key={bet.id}
                        className="border border-gray-700 rounded-lg p-4 bg-gray-900 shadow-md"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-lg font-semibold">
                                {bet.match ? (
                                    <>
                                        {bet.match.home_team_name} vs {bet.match.away_team_name}
                                    </>
                                ) : (
                                    <span className="italic text-gray-400">Матч не знайдено</span>
                                )}
                            </div>
                            <div className="text-sm text-gray-400">
                                {bet.match ? new Date(bet.match.start_time).toLocaleString() : ''}
                            </div>
                        </div>

                        <div className="flex justify-between text-orange-400 font-semibold text-lg">
                            <span>Сума ставки: {bet.amount} ₴</span>
                            <span>Коефіцієнт: {bet.coef}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
