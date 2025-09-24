import { NextResponse } from 'next/server';
// This would import your database connection utility
// import { query } from '@/lib/db';

export async function GET() {
  // const equipment = await query('SELECT * FROM equipment');
  const mockEquipment = [
      { id: 1, name: 'Laptop', quantity: 10 },
      { id: 2, name: 'Mouse', quantity: 25 },
      { id: 3, name: 'Keyboard', quantity: 2 },
  ];
  return NextResponse.json(mockEquipment);
}

export async function POST(request: Request) {
  const { name, quantity } = await request.json();
  // await query('INSERT INTO equipment (name, quantity) VALUES (?, ?)', [name, quantity]);
  return NextResponse.json({ success: true, message: 'Equipment added' });
}