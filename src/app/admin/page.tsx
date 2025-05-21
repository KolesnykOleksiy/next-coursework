'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import MatchList from '@/components/matches/MatchList'
import axios from 'axios'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import dayjs from "dayjs";

type Match = {
    id: number
    name: string
    home_team_name: string
    away_team_name: string
    home_team_score: number
    away_team_score: number
    status_type: string
    status_reason: string
    tournament_name: string
    start_time: string
    away_team_hash_image: string
    league_name: string
    league_hash_image: string
    home_team_hash_image: string
}

export default function AdminPage() {
    const [date, setDate] = useState<string>(() => dayjs().format('YYYY-MM-DD'))
    const [matches, setMatches] = useState<Match[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()

            if (error || !data?.user) {
                router.push('/login')
            } else {
                setUserEmail(data.user.email ?? null)
            }
        }

        fetchUser()
    }, [router])

    const handleSearch = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`/api/matches?date=${date}`)
            setMatches(res.data.matches)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Помилка при завантаженні матчів')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Hello admin {userEmail}</h1>

            <div className="flex items-center gap-4 mb-6">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Шукати
                </button>
            </div>

            {loading && <p>Loading matches...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {matches.length > 0 && (
                <>
                    <h2 className="text-lg font-semibold mb-3">Matches on {date}:</h2>
                    <MatchList matches={matches} />
                </>
            )}
        </div>
    )
}
