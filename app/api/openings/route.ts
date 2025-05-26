import executeQuery from "@/db/sql.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        let query = `SELECT * FROM open_positions ORDER BY id DESC`
        const allOpenings = await executeQuery({
            query,
        });
        return NextResponse.json(allOpenings);
    } catch (error: any) {
        console.error("Error fetching openings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      job_title,
      department,
      experience_min,
      experience_max,
      notice_period_days,
      available_positions,
      total_applied = 0,
      is_open = 1,
      location,
      job_type,
      description
    } = body;
    const result = await executeQuery({
      query: `
        INSERT INTO open_positions (
          job_title,
          department,
          experience_min,
          experience_max,
          notice_period_days,
          available_positions,
          total_applied,
          is_open,
          location,
          job_type,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        job_title,
        department,
        experience_min,
        experience_max,
        notice_period_days,
        available_positions,
        total_applied,
        is_open,
        location,
        job_type,
        description
      ],
    });

    return NextResponse.json({ id: 1, message: "Job created", job_id: result.insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ id: 0, error: "Failed to create job", details: error }, { status: 500 });
  }
}
