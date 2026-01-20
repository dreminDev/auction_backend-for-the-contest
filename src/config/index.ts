import dotenv from "dotenv";
import { z } from "zod";
import { logger } from "../../pkg/logger";

export const IS_DEV =
    process.env.NODE_ENV !== "production" &&
    Boolean(process.env.NODE_ENV);

const configValidator = z.object({
    ENV: z
        .enum(["production", "development", "test"])
        .default("production"),

    MONGO_USER: z.string(),
    MONGO_PASSWORD: z.string(),
    MONGO_NAME: z.string(),

    HTTP_SERVER_HOST: z.string().default("0.0.0.0"),
    HTTP_SERVER_PORT: z.string().transform(Number).default(5000),
});

const envConfig = dotenv.config({
    debug: IS_DEV,
});

if (envConfig.error || !envConfig.parsed) {
    logger.fatal({
        cause: envConfig.error,
        message:
            "some error ocured while parsing .env, please recheck and try again",
    });

    process.exit(1);
}

const parsed = configValidator.safeParse(envConfig.parsed);
if (!parsed.success) {
    const errMessage: Record<string, string> = {};

    parsed.error.issues.forEach((issue: any) => {
        const pathKey = issue.path[0];
        if (pathKey && typeof pathKey === "string") {
            errMessage[pathKey] = issue.message;
        }
    });

    logger.fatal({
        cause: parsed.error,
        message: "validation error ocured for config file",
    });

    throw new Error("validation error ocured for config file", {
        cause: parsed.error,
    });
}

export const config = {
    ...parsed.data,
};
