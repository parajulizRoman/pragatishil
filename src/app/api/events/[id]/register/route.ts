import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const eventId = params.id;

        // Check if already registered
        const { data: existing } = await supabase
            .from('event_attendees')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Already registered' }, { status: 400 });
        }

        // Register for event
        const { data: registration, error } = await supabase
            .from('event_attendees')
            .insert({
                event_id: eventId,
                user_id: user.id,
                status: 'registered'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ registration }, { status: 201 });
    } catch (error: unknown) {
        console.error('Event registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const eventId = params.id;

        const { error } = await supabase
            .from('event_attendees')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Event cancellation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Cancellation failed';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
