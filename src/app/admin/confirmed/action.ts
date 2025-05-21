'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
export async function getMatches() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .is('status_type', null)
    if (error) throw new Error(error.message)
    return data
}
export async function updateMatch(id: number, data: any) {
    const supabase = await createClient()

    const updateData = {
        home_team_score: data.home_team_score !== '' ? parseInt(data.home_team_score) : null,
        away_team_score: data.away_team_score !== '' ? parseInt(data.away_team_score) : null,
        coefficient_home: data.coefficient_home !== '' ? parseFloat(data.coefficient_home) : null,
        coefficient_away: data.coefficient_away !== '' ? parseFloat(data.coefficient_away) : null,
    }


    const { error } = await supabase.from('matches').update(updateData).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/confirmed')
}

export async function deleteMatch(id: number) {
    const supabase = await createClient()
    const { error } = await supabase.from('matches').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/confirmed')
}
export async function finishMatch(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('matches')
        .update({ status_type: 'finished' })
        .eq('id', id)

    if (error) throw new Error(error.message)
    const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('home_team_score, away_team_score, home_team_name, away_team_name')
        .eq('id', id)
        .single()

    console.log(match)
    if (matchError || !match) throw new Error('Не вдалося отримати дані матчу')

    const { home_team_score, away_team_score, home_team_name, away_team_name } = match

    let winnerTeamName: string | null = null

    if (home_team_score > away_team_score) {
        winnerTeamName = home_team_name
    } else if (away_team_score > home_team_score) {
        winnerTeamName = away_team_name
    } else {
        winnerTeamName = null
    }

    const { data: bets, error: betsError } = await supabase
        .from('bets')
        .select('id, user_id, team_name, amount, coef')
        .eq('match_id', id)

    console.log(bets)
    if (betsError || !bets) throw new Error('Не вдалося отримати ставки')

    for (const bet of bets) {
        const isWin = winnerTeamName && bet.team_name === winnerTeamName

        const { error: updateBetError } = await supabase
            .from('bets')
            .update({ success: isWin })
            .eq('id', bet.id)

        if (updateBetError) console.error(`Помилка при оновленні ставки ${bet.id}:`, updateBetError.message)

        if (isWin) {
            const winAmount = bet.amount * bet.coef

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('total_sum')
                .eq('id', bet.user_id)
                .single()

            if (profileError) {
                console.error(`Помилка при отриманні балансу користувача ${bet.user_id}:`, profileError.message)
                return
            }

            const newTotalSum = profile.total_sum + winAmount

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ total_sum: newTotalSum })
                .eq('id', bet.user_id)

            if (updateError) {
                console.error(`Помилка при оновленні балансу користувача ${bet.user_id}:`, updateError.message)
            }
        }
    }

    revalidatePath('/admin/confirmed')
}
