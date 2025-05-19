import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    console.log("визов мідла")
    const response = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookies) => {
                    for (const cookie of cookies) {
                        response.cookies.set(cookie.name, cookie.value, cookie.options)
                    }
                },
            },
        }
    )

    if (request.nextUrl.pathname.startsWith('/admin')) {
        const {
            data: { user },
        } = await supabase.auth.getUser() // ✅ більш безпечний варіант
        console.log(user)
        if (!user) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/login'
            redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        console.log(profile)

        if (error || !profile || profile.role !== 'admin') {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/'
            return NextResponse.redirect(redirectUrl)
        }
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}
