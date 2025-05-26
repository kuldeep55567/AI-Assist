import { NextResponse } from 'next/server';
import executeQuery from '@/db/sql.config';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email parameter required' },
                { status: 400 }
            );
        }

        const results = await executeQuery({
            query:`SELECT * FROM interview_results WHERE email = ? ORDER BY created_at DESC LIMIT 10`,
            values:[email]
        });

        return NextResponse.json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error('Error fetching results:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch results' },
            { status: 500 }
        );
    }
}