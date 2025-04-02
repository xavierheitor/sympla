import winston from "winston";
import path from "path";

// Níveis customizados incluindo 'http'
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        http: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        http: "magenta",
        info: "green",
        debug: "blue",
    },
};

// Aplica as cores nos logs de console
winston.addColors(customLevels.colors);

// Formato do log no console
const consoleFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

// Geração dinâmica de transporte para arquivos
const createFileTransport = (level: string) =>
    new winston.transports.File({
        filename: path.join("logs", `${level}.log`),
        level,
    });

// Logger principal
const logger = winston.createLogger({
    levels: customLevels.levels,
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
    ),
    transports: [
        createFileTransport("error"),
        createFileTransport("warn"),
        createFileTransport("http"),
        createFileTransport("info"),
        createFileTransport("debug"),
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp({ format: "HH:mm:ss" }),
                consoleFormat
            ),
        }),
    ],
});

// Logger separado para Prisma
const prismaLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join("logs", "prisma.log"),
            level: "info",
        }),
    ],
});

export { logger, prismaLogger };