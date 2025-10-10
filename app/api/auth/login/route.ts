import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock API endpoint - Replace with your actual authentication logic
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with your actual authentication logic
    // This should validate credentials against your database
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock authentication - Replace with real authentication
    const isValidUser = email === 'test@example.com' && password === 'password123';
    
    if (!isValidUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token (replace with your actual JWT generation)
    const token = 'mock-jwt-token-' + Date.now();
    
    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: '1',
        email: email,
        isOnline: true
      }
    });

    // Set HttpOnly cookie with security flags
    response.cookies.set('authToken', token, {
      httpOnly: true,        // Prevents XSS attacks
      secure: true,          // Only send over HTTPS
      sameSite: 'strict',    // Prevents CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',             // Available site-wide
    });

    // Optional: Set a separate cookie for user data (also HttpOnly)
    response.cookies.set('userData', JSON.stringify({
      id: '1',
      email: email,
      isOnline: true
    }), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
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
