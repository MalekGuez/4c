import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear authentication cookies
    response.cookies.set('authToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    response.cookies.set('userData', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    // Clear admin cookies if they exist
    response.cookies.set('adminToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('adminManager', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
