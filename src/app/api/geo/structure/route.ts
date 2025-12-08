import { NextResponse } from 'next/server';
import { getGeoStructure } from '@/lib/geo';

export const revalidate = 86400; // Cache for 24 hours (data rarely changes)

export async function GET() {
    try {
        const data = await getGeoStructure();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API /geo/structure error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch geo structure' },
            { status: 500 }
        );
    }
}
