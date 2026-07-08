import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../../../lib/api-url';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Call the external API
    const response = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Registration failed' },
        { status: response.status }
      );
    }

    // Set the token in an httpOnly cookie
    const res = NextResponse.json({ success: true, data });

    res.cookies.set('session_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}