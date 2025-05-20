import { createClient } from '@/utils/supabase/server'
import dayjs from 'dayjs'

export default async function MatchPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: match, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !match) {
        return <div className="p-4 text-red-600 text-center text-xl">Матч не знайдено</div>
    }

    return (
        <div
            className="max-w-3xl mx-auto p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 mt-10 space-y-8 text-white">
            {/* Ліга і дата */}
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

            {/* Команди */}
            <div className="relative flex items-center justify-between px-4">
                <div className="flex items-center gap-4 w-1/2 justify-start">
                    <img
                        src={`https://images.sportdevs.com/${match.home_team_hash_image}.png`}
                        alt={match.home_team_name}
                        className="w-14 h-14 rounded-full object-contain border border-orange-500"
                    />
                    <span className="text-2xl font-bold truncate">{match.home_team_name}</span>
                </div>

                {/* VS по центру */}
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

            {/* Коефіцієнти */}
            <div className="grid grid-cols-3 gap-4">
                <div
                    className="bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg text-xl font-bold cursor-pointer transition duration-200">
                    {match.coefficient_home}
                </div>
                <div className=" text-center py-3 rounded-lg text-xl font-bold">

                </div>
                <div
                    className="bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg text-xl font-bold cursor-pointer transition duration-200">
                    {match.coefficient_away}
                </div>
            </div>
        </div>
    )
}
