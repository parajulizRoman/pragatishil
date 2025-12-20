import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Refresh session if needed
    // IMPORTANT: using getSession() is faster (no DB call) but less secure than getUser().
    // For general middleware routing/session refreshing, getSession is acceptable if RLS handles data security.
    // For general middleware routing/session refreshing, getSession is acceptable if RLS handles data security.
    await supabase.auth.getSession()
    // const user = session?.user // Unused

    // Protected Route Logic
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // For Admin routes, we MUST verify with getUser() to ensure the user isn't banned/deleted
        const { data: { user: verifiedUser }, error } = await supabase.auth.getUser()

        if (!verifiedUser || error) {
            console.log("Middleware: No verified user session found for /admin")
            return NextResponse.redirect(new URL('/join', request.url))
        }

        // Check ADMIN role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', verifiedUser.id)
            .single()

        console.log(`Middleware: User ${verifiedUser.email} (ID: ${verifiedUser.id}) has role: ${profile?.role}`)

        const adminRoles = ['admin_party', 'yantrik', 'admin', 'board', 'central_committee'];
        if (!profile || !adminRoles.includes(profile.role)) {
            console.warn(`Unauthorized access attempt to admin by ${verifiedUser.email} with role: ${profile?.role}`)
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
