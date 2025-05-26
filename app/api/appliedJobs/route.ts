// app/api/appliedJobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import executeQuery from "@/db/sql.config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const query = `
      SELECT id FROM job_applicants
      WHERE email = ?
    `;
    
    const appliedJobs = await executeQuery({ query, values: [email] });
    
    return NextResponse.json(appliedJobs);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json({ error: "Failed to fetch applied jobs" }, { status: 500 });
  }
}