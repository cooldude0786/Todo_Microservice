import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      return Response.json({ authenticated: true, user: session.user });
    } else {
      return Response.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return Response.json({ error: 'Session check failed' }, { status: 500 });
  }
}