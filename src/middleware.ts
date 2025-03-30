import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
    // const pathName = request.nextUrl.pathname;
    // Usar a API oficial do NextAuth para obter o token decodificado
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Verificar se o usuário está autenticado
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"], // Middleware aplicado a rotas dentro de /dashboard
};
