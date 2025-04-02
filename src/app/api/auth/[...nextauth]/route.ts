import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from "bcrypt";
import { prisma } from "@/lib/common/db/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Usuário", type: "text", placeholder: "Digite seu usuário" },
                password: { label: "Senha", type: "password", placeholder: "Digite sua senha" },
            },
            async authorize(credentials) {
                const { username, password } = credentials as { username: string, password: string }

                const user = await prisma.user.findUnique({
                    where: {
                        username: username,
                    }
                });

                if (!user) throw new Error("Usuário não encontrado!");

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) throw new Error("Usuário ou senha inválidos!");

                return {
                    username: user.username,
                    email: user.email ?? "",
                    id: user.id.toString(),
                };

            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hora
        updateAge: 30 * 60, // Atualizar sessãoÏ a cada 30 minutos
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username;
                token.email = user.email ?? "";
                token.id = user.id;
            }
            //adicionar aqui toda logica de buscar as permissoes do usuario
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.email = token.email;

                //define o id do usuario pros logs do prisma
            }
            return session;
        },
        async signIn() {
            return true;
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)

// Se estiver usando o diretório 'app' do Next.js 13, use:
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
