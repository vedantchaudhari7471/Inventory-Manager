import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // In a real app, you would validate against a database
    if (username === 'admin' && password === 'adminpass') {
      return NextResponse.json({ success: true, user: { name: 'Admin', role: 'admin' } });
    } else if (username === 'user' && password === 'userpass') {
      return NextResponse.json({ success: true, user: { name: 'User', role: 'user' } });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}