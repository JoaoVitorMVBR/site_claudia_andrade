// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Defina suas credenciais aqui ou melhor ainda, no .env (recomendado)
const USERNAME = process.env.ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.ADMIN_PASSWORD || 'siteclaudia2025';

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) return false;

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  return username === USERNAME && password === PASSWORD;
}

export function middleware(request: NextRequest) {
  // Protege apenas rotas que começam com /adm/produtos
  if (request.nextUrl.pathname.startsWith('/adm/produtos')) {
    if (!isAuthenticated(request)) {
      return new NextResponse('Acesso negado. Autenticação necessária.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Painel Administrativo"',
        },
      });
    }
  }

  // Permite o acesso a todas as outras rotas
  return NextResponse.next();
}

// Configura o middleware apenas para as rotas desejadas
export const config = {
  matcher: '/adm/produtos/:path*',
};