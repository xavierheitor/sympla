"use server"

import { prisma } from "@/lib/db/prisma"

interface Empresa {
    id: number
    name: string
    cnpj: string
}

export async function fetchEmpresas(): Promise<Empresa[]> {
    try {
        const empresas = await prisma.empresa.findMany()
        return empresas.map((empresa) => ({
            id: empresa.id,
            name: empresa.nome,
            cnpj: "00.000.000/0000-00",
        }))
    } catch (error: unknown) {
        console.error("Erro ao buscar empresas:", error)
        throw new Error("Erro ao buscar empresas! " + error)
    }
}