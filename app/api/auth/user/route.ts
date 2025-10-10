import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken');
    const userData = cookieStore.get('userData');

    if (!authToken || !userData) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // TODO: Replace with your actual JWT verification logic
    const isValidToken = authToken.value.startsWith('mock-jwt-token-');
    
    if (!isValidToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Return user data from cookie
    const user = JSON.parse(userData.value);
    
    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
