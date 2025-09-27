import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// GET all equipment
export async function GET() {
  const { rows } = await sql`SELECT * FROM equipment ORDER BY id;`;
  return NextResponse.json(rows);
}

// POST new equipment
export async function POST(req: Request) {
  const { name, quantity, price } = await req.json();
  const total = quantity;

  const { rows } = await sql`
    INSERT INTO equipment (name, quantity, total, price)
    VALUES (${name}, ${quantity}, ${total}, ${price})
    RETURNING *;
  `;

  return NextResponse.json(rows[0]);
}
