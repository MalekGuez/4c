import { NextRequest, NextResponse } from 'next/server';

// Fonction pour obtenir l'IP du client
function getClientIp(request: NextRequest): string | null {
  // En production, l'IP peut être dans différents headers selon le proxy/CDN utilisé
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  if (realIp) {
    return realIp;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const isMaintenancePage = pathname === '/maintenance';
  
  // Vérifier si l'IP du client est autorisée pendant la maintenance
  const allowedIp = process.env.MAINTENANCE_ALLOWED_IP;
  const clientIp = getClientIp(request);
  const isAllowedIp = allowedIp && clientIp === allowedIp;
  
  // Si le mode maintenance est actif ET que l'IP n'est pas autorisée
  if (isMaintenanceMode && !isMaintenancePage && !isAllowedIp) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  const connectSrc = process.env.NODE_ENV === 'production'
    ? "'self' https://api.4chaos.com https://www.paypal.com https://www.sandbox.paypal.com"
    : "'self' http://37.187.48.183:8080 https://api.4chaos.com https://www.paypal.com https://www.sandbox.paypal.com";
  
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.paypal.com https://www.paypalobjects.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob: https://www.paypalobjects.com; " +
    "font-src 'self'; " +
    `connect-src ${connectSrc}; ` +
    "frame-src https://www.paypal.com https://www.sandbox.paypal.com; " +
    "frame-ancestors 'none';"
  );

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
};
