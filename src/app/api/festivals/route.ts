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

    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month'); // BS month (0-11)
        const category = searchParams.get('category');

        let query = supabase
            .from('nepali_festivals')
            .select('*')
            .order('bs_month', { ascending: true })
            .order('bs_day', { ascending: true });

        if (month) {
            query = query.eq('bs_month', parseInt(month));
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data: festivals, error } = await query;

        if (error) throw error;

        return NextResponse.json({ festivals: festivals || [] });
    } catch (error: unknown) {
        console.error('Festivals fetch error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch festivals';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
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

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['admin', 'yantrik'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name_en, name_ne, bs_month, bs_day, category, description_en, description_ne, image_url, is_public_holiday } = body;

        const { data: festival, error } = await supabase
            .from('nepali_festivals')
            .insert({
                name_en,
                name_ne,
                bs_month,
                bs_day,
                category,
                description_en,
                description_ne,
                image_url,
                is_public_holiday
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ festival }, { status: 201 });
    } catch (error: unknown) {
        console.error('Festival creation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create festival';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
