import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const channel_id = searchParams.get('channel_id');
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming');

    try {
        // Get single event
        if (id) {
            const { data: event, error } = await supabase
                .from('party_events')
                .select(`
                    *,
                    creator:created_by(id, full_name, avatar_url, role),
                    channel:channel_id(id, name, slug),
                    attendees:event_attendees(count)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return NextResponse.json({ event });
        }

        // Get list of events
        let query = supabase
            .from('party_events')
            .select(`
                *,
                creator:created_by(id, full_name, avatar_url),
                channel:channel_id(id, name, slug),
                attendees:event_attendees(count)
            `)
            .order('start_datetime', { ascending: true });

        // Filter by channel
        if (channel_id) {
            query = query.eq('channel_id', channel_id);
        }

        // Filter by status
        if (status) {
            query = query.eq('status', status);
        }

        // Filter upcoming events
        if (upcoming === 'true') {
            query = query.gte('start_datetime', new Date().toISOString());
        }

        const { data: events, error } = await query;

        if (error) throw error;
        return NextResponse.json({ events });
    } catch (error: any) {
        console.error('Events GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
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
        const body = await request.json();
        const {
            title,
            description,
            event_type,
            start_datetime,
            end_datetime,
            location,
            location_type,
            meeting_link,
            visibility,
            channel_id
        } = body;

        if (!title || !event_type || !start_datetime) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { data: event, error } = await supabase
            .from('party_events')
            .insert({
                title,
                description,
                event_type,
                start_datetime,
                end_datetime,
                location,
                location_type,
                meeting_link,
                visibility: visibility || 'public',
                channel_id,
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ event }, { status: 201 });
    } catch (error: any) {
        console.error('Events POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
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
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
        }

        const body = await request.json();

        const { data: event, error } = await supabase
            .from('party_events')
            .update(body)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ event });
    } catch (error: any) {
        console.error('Events PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
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
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('party_events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Events DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
