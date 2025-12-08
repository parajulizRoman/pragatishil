import { NextRequest, NextResponse } from 'next/server';
import { createMembershipApplication } from '@/services/membership';
import { MembershipRequestPayload } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic structural check (TS doesn't validate runtime, but we assume body is JSON)
        const payload = body as MembershipRequestPayload;

        if (!payload.personal || !payload.contact || !payload.party) {
            return NextResponse.json({ error: 'Missing required sections (personal, contact, party)' }, { status: 400 });
        }

        const { memberId } = await createMembershipApplication(payload);

        return NextResponse.json({ id: memberId }, { status: 201 });
    } catch (error) {
        console.error("API /membership error:", error);

        // Distinguish validation vs internal errors
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        const status = errorMessage.includes("required") ? 400 : 500;

        return NextResponse.json(
            { error: errorMessage },
            { status: status }
        );
    }
}
