'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import dayjs from 'dayjs'
import BetInput from '@/components/matches/BetInput'

export default function MatchPage() {
    const params = useParams()
    const matchId = params?.id as string

    const [match, setMatch] = useState<any>(null)
    const [balance, setBalance] = useState<number>(0)
    const [selectedCoef, setSelectedCoef] = useState<number | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [team_name, setTeamName] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError || !user) return

            setUserId(user.id)

            const { data: matchData } = await supabase
                .from('matches')
                .select('*')
                .eq('id', matchId)
                .single()

            setMatch(matchData)

            const { data: profiles } = await supabase
                .from('profiles')
                .select('total_sum')
                .eq('id', user.id)
                .single()

            setBalance(profiles?.total_sum || 0)
        }

        if (matchId) {
            fetchData()
        }
    }, [matchId])

    const handleCoefSelect = (coef: number) => {
        setSelectedCoef(coef);
        if (coef === match?.coefficient_home) {
            setTeamName(match.home_team_name);
        } else if (coef === match?.coefficient_away) {
            setTeamName(match.away_team_name);
        } else {
            setTeamName(null);
        }
    }

    if (!match) {
        return <div className="text-center text-white p-10">Завантаження матчу...</div>
    }

    if (!userId) {
        return <div className="text-center text-white p-10">Потрібна авторизація</div>
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 text-white bg-gray-900">
            <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://images.sportdevs.com/${match.league_hash_image}.png`}
                            alt={match.league_name}
                            className="w-12 h-12 rounded-full object-contain"
                        />
                        <span className="text-xl font-semibold">{match.league_name}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                        {dayjs(match.start_time).format('DD.MM.YYYY HH:mm')}
                    </span>
                </div>

                <div className="relative flex items-center justify-between px-4">
                    <div className="flex items-center gap-4 w-1/2 justify-start">
                        <img
                            src={`https://images.sportdevs.com/${match.home_team_hash_image}.png`}
                            alt={match.home_team_name}
                            className="w-14 h-14 rounded-full object-contain border border-orange-500"
                        />
                        <span className="text-2xl font-bold truncate">{match.home_team_name}</span>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-400">
                        vs
                    </div>

                    <div className="flex items-center gap-4 w-1/2 justify-end">
                        <span className="text-2xl font-bold truncate">{match.away_team_name}</span>
                        <img
                            src={`https://images.sportdevs.com/${match.away_team_hash_image}.png`}
                            alt={match.away_team_name}
                            className="w-14 h-14 rounded-full object-contain border border-orange-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div
                        onClick={() => handleCoefSelect(match.coefficient_home)}
                        className={`text-white text-center py-3 rounded-lg text-xl font-bold cursor-pointer transition duration-300 transform ${
                            selectedCoef === match.coefficient_home
                                ? 'bg-orange-700 border-2 border-yellow-400 shadow-lg scale-105'
                                : 'bg-orange-500 hover:bg-orange-600 hover:scale-105 border border-transparent'
                        }`}
                    >
                        {match.coefficient_home}
                    </div>
                    <div className="text-center py-3 rounded-lg text-xl font-bold text-gray-300">X</div>
                    <div
                        onClick={() => handleCoefSelect(match.coefficient_away)}
                        className={`text-white text-center py-3 rounded-lg text-xl font-bold cursor-pointer transition duration-300 transform ${
                            selectedCoef === match.coefficient_away
                                ? 'bg-orange-700 border-2 border-yellow-400 shadow-lg scale-105'
                                : 'bg-orange-500 hover:bg-orange-600 hover:scale-105 border border-transparent'
                        }`}
                    >
                        {match.coefficient_away}
                    </div>
                </div>
            </div>

            <BetInput
                balance={balance}
                userId={userId}
                matchId={match.id}
                selectedCoef={selectedCoef}
                team_name={team_name}
                onBetSuccess={(newBalance: number) => setBalance(newBalance)}
            />
        </div>
    )
}