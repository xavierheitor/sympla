"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ExtendedSession } from "@/lib/definitions/default/ExtendedSession";
import { getServerSession } from "next-auth";
import { logger } from "../logger";
import { redirect } from "next/navigation";


/**
 * Verifica se o usuário está autenticado e retorna as informações do usuário
 * Para adicionar mais informacoes na sessao, basta adicionar no callback do session do authOptions
 * e modificar o tipo de ExtendedSession
 * @returns {Promise<ExtendedSession | null>} As informações do usuário ou null se não estiver autenticado
 */
export async function verifySession(): Promise<ExtendedSession | null> {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            handleRedirection("/login");
            return null;
        }

        const userId = parseInt(session.user.id, 10);
        const username = session.user.username;

        return {
            userId,
            username,
        };
    } catch (error) {
        logger.error("Erro ao verificar sessão", error);
        handleRedirection("/login");
        return null;
    }
}

/**
 * Redireciona para a url informada
 * @param url - A url para redirecionar
 */
function handleRedirection(url: string) {
    logger.info(`Redirecionando para ${url}`);
    redirect(url);
}