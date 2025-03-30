import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";


declare module "next-auth"{
    interface User extends DefaultUser{
        id: string;
        username: string;
        email: string;
    }

    interface Session extends DefaultSession{
        user: {
            id: string;
            name?: string;
            username: string;
            email: string;
        }
    }
}

declare module "next-auth/jwt"{
    interface JWT extends DefaultJWT{
        id: string;
        username: string;
        email: string;
    }
}