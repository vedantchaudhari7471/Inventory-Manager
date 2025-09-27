import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// GET all users
export async function GET() {
  const { rows } = await sql`SELECT * FROM users ORDER BY id;`;
  return NextResponse.json(rows);
}

// POST create user
export async function POST(req: Request) {
  const { name, role } = await req.json();

  const { rows } = await sql`
    INSERT INTO users (name, role)
    VALUES (${name}, ${role})
    RETURNING *;
  `;

  return NextResponse.json(rows[0]);
}
