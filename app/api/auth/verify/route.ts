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
    // This should verify the JWT token and check if it's still valid
    const isValidToken = authToken.value.startsWith('mock-jwt-token-');
    
    if (!isValidToken) {
      // Clear invalid cookies
      const response = NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );

      response.cookies.set('authToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      response.cookies.set('userData', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      return response;
    }

    // Return user data
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
