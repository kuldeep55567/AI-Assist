import { NextRequest, NextResponse } from "next/server";
import executeQuery from "@/db/sql.config";

export async function GET(req: NextRequest): Promise<NextResponse<any>> {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const query = email
      ? `
        SELECT questions_data, created_at 
        FROM interview_sets 
        WHERE email = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `
      : `
        SELECT questions_data, created_at 
        FROM interview_sets 
        WHERE email = 'N/A'
        ORDER BY created_at DESC 
        LIMIT 1
      `;

    const values = email ? [email] : [];
    const result = await executeQuery({
      query,
      values
    });

    if (!result || result.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No interview questions found',
        message: email 
          ? 'No questions found for the specified email'
          : 'No default questions (N/A) found in database'
      }, { status: 404 });
    }

    const questionsData = typeof result[0].questions_data === 'object'
      ? result[0].questions_data
      : JSON.parse(result[0].questions_data);

    return NextResponse.json({
      success: true,
      data: questionsData,
      message: 'Interview questions retrieved successfully'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process interview questions',
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
}