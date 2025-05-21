import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
        return NextResponse.json({ error: 'Missing date' }, { status: 400 })
    }

    try {
        const queryParams = new URLSearchParams({
            date: `eq.${date}`,
        }).toString()

        const response = await fetch(`https://esports.sportdevs.com/matches-by-date?${queryParams}`, {
            headers: {
                'Authorization': process.env.CYBERSPORT_API_KEY!,
                'Accept': 'application/json'
            }
        })

        const data = await response.json()

        return NextResponse.json({ matches: data?.[0]?.matches?.slice(0, 10) || [] })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
    }
}
