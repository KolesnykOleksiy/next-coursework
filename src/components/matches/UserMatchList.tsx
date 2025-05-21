'use client'

import React from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function UserMatchList({ matches }: { matches: any[] }) {
    const router = useRouter()
    const supabase = createClient()

    const handleClick = async (matchId: number) => {
        // Перевіряємо авторизацію при кліку
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            // Якщо не авторизований - перенаправляємо на реєстрацію
            router.push('/registration')
        } else {
            // Якщо авторизований - переходимо на сторінку матчу
            router.push(`/match/${matchId}`)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(match => (
                <div
                    key={match.id}
                    onClick={() => handleClick(match.id)}
                    className="cursor-pointer border border-orange-500 rounded-xl p-4 shadow-md bg-black text-white flex flex-col gap-4 hover:bg-orange-950 transition-colors"
                >
                    {/* Ліга по центру */}
                    <div className="flex justify-center">
                        <img
                            src={`https://images.sportdevs.com/${match.league_hash_image}.png`}
                            alt={match.league_name}
                            className="w-8 h-8 rounded-full object-contain"
                        />
                    </div>

                    {/* Дата */}
                    <div className="text-center text-xs text-gray-400">
                        {dayjs(match.start_time).format('DD.MM.YYYY HH:mm')}
                    </div>

                    {/* Команди */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 w-1/2">
                            <img
                                src={`https://images.sportdevs.com/${match.home_team_hash_image}.png`}
                                alt={match.home_team_name}
                                className="w-6 h-6 rounded-full object-contain"
                            />
                            <span className="text-sm font-medium truncate">{match.home_team_name}</span>
                        </div>
                        <span className="text-sm text-gray-300">vs</span>
                        <div className="flex items-center gap-2 w-1/2 justify-end">
                            <span className="text-sm font-medium truncate">{match.away_team_name}</span>
                            <img
                                src={`https://images.sportdevs.com/${match.away_team_hash_image}.png`}
                                alt={match.away_team_name}
                                className="w-6 h-6 rounded-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Коефіцієнти */}
                    <div className="flex justify-around text-sm font-semibold">
                        <div className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded w-1/3 text-center transition">
                            {match.coefficient_home}
                        </div>
                        <div className="text-gray-400 font-medium">-</div>
                        <div className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded w-1/3 text-center transition">
                            {match.coefficient_away}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}