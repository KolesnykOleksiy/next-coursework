'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
export async function getMatches() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('matches').select('*')
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