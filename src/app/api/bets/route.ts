import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()
    const { user_id, match_id, coef, amount,team_name } = body

    if (!user_id || !match_id || !coef || !amount || amount < 25) {
        return NextResponse.json({ error: 'Невірні дані' }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_sum')
        .eq('id', user_id)
        .single()

    if (profileError || !profile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (profile.total_sum < amount) {
        return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('bets')
        .insert({ user_id, match_id, coef, amount,team_name })

    if (error) {
        return NextResponse.json({ error: 'Failed to make a bet.' }, { status: 500 })
    }

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ total_sum: profile.total_sum - amount })
        .eq('id', user_id)


    if (updateError) {
        return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
