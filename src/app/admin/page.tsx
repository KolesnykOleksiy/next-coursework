import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import axios from 'axios'
import MatchList from "@/components/matches/MatchList";
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
    away_team_hash_image: string;
    league_name: string;
    league_hash_image: string;
    home_team_hash_image: string;
}


export default async function AdminPage() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
        redirect('/login')
    }


    // Параметри запиту
    const queryParams = new URLSearchParams({
        date: 'eq.2025-05-19',
    }).toString()

    try {
        console.log(queryParams)
        const response = await axios.get(
            `https://esports.sportdevs.com/matches-by-date?${queryParams}`,
            {
                headers: {
                    'Authorization': 'Bearer VrXeSLcnhkKmqZ654AnMbA',
                    'Accept': 'application/json'
                }
            }
        )

        const matches = response.data?.[0]?.matches?.slice(0, 10) || []

        return (
            <div>
                <p>Hello admin {data.user.email}</p>
                <h2>Top 10 Matches on 1930-07-26:</h2>
                <MatchList matches={matches}></MatchList>
            </div>
        )
    } catch (apiError) {
        return (
            <div>
                <p>Hello admin {data.user.email}</p>
                <p>Error fetching matches: {String(apiError)}</p>
            </div>
        )
    }
}


//VrXeSLcnhkKmqZ654AnMbA