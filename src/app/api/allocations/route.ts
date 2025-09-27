import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// GET all allocations with equipment + user info
export async function GET() {
  const { rows } = await sql`
    SELECT a.id, a.quantity, u.name as user_name, u.role, e.name as equipment_name, e.price, c.name as competition
    FROM allocations a
    JOIN users u ON a.user_id = u.id
    JOIN equipment e ON a.equipment_id = e.id
    JOIN competitions c ON a.competition_id = c.id;
  `;
  return NextResponse.json(rows);
}

// POST allocation
export async function POST(req: Request) {
  const { userId, equipmentId, competitionId, quantity } = await req.json();

  const { rows } = await sql`
    INSERT INTO allocations (user_id, equipment_id, competition_id, quantity)
    VALUES (${userId}, ${equipmentId}, ${competitionId}, ${quantity})
    RETURNING *;
  `;

  // also decrease stock
  await sql`
    UPDATE equipment SET quantity = quantity - ${quantity}
    WHERE id = ${equipmentId};
  `;

  return NextResponse.json(rows[0]);
}
