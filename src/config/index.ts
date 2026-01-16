import dotenv from "dotenv";
import { z } from "zod";

export const IS_DEV =
    process.env.NODE_ENV !== "production" && Boolean(process.env.NODE_ENV);

const configValidator = z.object({
    ENV: z.enum(["production", "development", "test"]).default("production"),

    DATABASE_NAME: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    

    HTTP_SERVER_HOST: z.string().default("0.0.0.0"),
    HTTP_SERVER_PORT: z.string().transform(Number).default(5000),
});

const envConfig = dotenv.config({
    debug: IS_DEV,
});

if (envConfig.error || !envConfig.parsed) {
    console.error(
        "some error ocured while parsing .env, please recheck and try again",
        envConfig.error
    );

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

    console.error("validation error ocured for config file", {
        is_valid_config: parsed.success,
        err: errMessage,
    });

    process.exit(1);
}

export const config = {
    ...parsed.data,
};
