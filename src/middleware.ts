import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const role = request.cookies.get('role')?.value

    if (request.nextUrl.pathname === '/' && role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/admin/:path*'],
}
