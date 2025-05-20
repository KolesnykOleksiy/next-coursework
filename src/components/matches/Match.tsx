'use client'
import React, {useState} from 'react'
import dayjs from 'dayjs'
import EditMatchModal from '@/components/modals/CoefMatchWindow'
import { supabase } from '@/utils/supabase/client'
export type MatchType = {
    id: number
    home_team_name: string
    away_team_name: string
    home_team_score: number
    away_team_score: number
    status_type: string
    status_reason: string
    tournament_name: string
    league_name: string
    start_time: string
    home_team_hash_image: string
    away_team_hash_image: string
    league_hash_image: string
}

type MatchProps = {
    match: MatchType,
    onDelete:(id: number) => void
}

export default function Match({ match, onDelete }: MatchProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleConfirm = async (coeffHome: number, coeffAway: number) => {
        setIsEditing(false)
        const {error} = await supabase.from('matches').insert({
            id: match.id,
            home_team_name: match.home_team_name,
            away_team_name: match.away_team_name,
            home_team_score: match.home_team_score,
            away_team_score: match.away_team_score,
            status_type: match.status_type,
            status_reason: match.status_reason,
            tournament_name: match.tournament_name,
            league_name: match.league_name,
            start_time: match.start_time,
            home_team_hash_image: match.home_team_hash_image,
            away_team_hash_image: match.away_team_hash_image,
            league_hash_image: match.league_hash_image,
            coefficient_home: coeffHome,
            coefficient_away: coeffAway
        })

        if (error) {
            console.error('Помилка вставки в Supabase:', error)
        } else {
            console.log('Матч успішно збережено з коефіцієнтами')
            onDelete(match.id)
        }
    }
    return (
        <li
            className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-100 hover:shadow-lg transition relative"
        >
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setIsEditing(true)}
                >
                    Редагувати
                </button>
                <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => onDelete(match.id)}
                >
                    Видалити
                </button>
            </div>

            <div className="flex items-start gap-4 mb-4">
                <img
                    src={`https://images.sportdevs.com/${match.league_hash_image}.png`}
                    alt={match.league_name}
                    className="w-10 h-10 rounded-full"
                />

                <div className="flex-1">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <img
                            src={`https://images.sportdevs.com/${match.home_team_hash_image}.png`}
                            alt={match.home_team_name}
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold">{match.home_team_name}</span>
                        <span className="text-sm text-gray-500">vs</span>
                        <span className="font-semibold">{match.away_team_name}</span>
                        <img
                            src={`https://images.sportdevs.com/${match.away_team_hash_image}.png`}
                            alt={match.away_team_name}
                            className="w-8 h-8 rounded-full"
                        />
                    </div>

                    <div className="text-sm text-gray-700 text-center">
                        <p>
                            <span className="font-semibold">Score:</span>{' '}
                            {match.home_team_score} - {match.away_team_score}
                        </p>
                        <p>
                            <span className="font-semibold">Status:</span>{' '}
                            {match.status_reason} ({match.status_type})
                        </p>
                        <p>
                            <span className="font-semibold">Tournament:</span>{' '}
                            {match.tournament_name}
                        </p>
                        <p>
                            <span className="font-semibold">Time:</span>{' '}
                            {
                                dayjs(match.start_time).format('DD.MM.YYYY HH:mm')
                            }
                        </p>
                    </div>
                </div>
            </div>
            {isEditing && (
                <EditMatchModal
                    match={match}
                    onClose={() => setIsEditing(false)}
                    onConfirm={handleConfirm}
                />
            )}
        </li>
    )
}
