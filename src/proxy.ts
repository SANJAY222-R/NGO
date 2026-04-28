import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Public paths
  if (path.startsWith('/api/auth') || path === '/signin' || path === '/signup') {
    return;
  }

  // Redirect to signin if not logged in (and not on public page)
  if (!isLoggedIn && path !== '/') {
    return Response.redirect(new URL('/signin', nextUrl));
  }

  if (isLoggedIn) {
    const role = req.auth?.user?.role as string;

    // RBAC logic for dashboards
    if (path.startsWith('/dashboard/donor') && role !== 'DONOR') {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    if (path.startsWith('/dashboard/ngo') && role !== 'NGO') {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    if (path.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    
    // Auto-routing to specific dashboard based on role
    if (path === '/dashboard' || path === '/') {
      if (role === 'DONOR') return Response.redirect(new URL('/dashboard/donor', nextUrl));
      if (role === 'NGO') return Response.redirect(new URL('/dashboard/ngo', nextUrl));
      if (role === 'ADMIN') return Response.redirect(new URL('/dashboard/admin', nextUrl));
    }
  }
});

export const config = {
  // Ensure we don't run middleware on static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
