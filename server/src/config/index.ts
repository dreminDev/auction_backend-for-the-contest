import dotenv from "dotenv";
import { z } from "zod";

import { logger } from "../../pkg/logger";

export const IS_DEV = process.env.NODE_ENV !== "production" && Boolean(process.env.NODE_ENV);

const configValidator = z.object({
    ENV: z.enum(["production", "development", "test"]).default("production"),

    DATABASE_URL: z.string(),
    HTTP_SERVER_HOST: z.string().default("0.0.0.0"),
    HTTP_SERVER_PORT: z.string().transform(Number).default(5000),
});

const parsed = configValidator.safeParse(process.env);
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
