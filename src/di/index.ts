import { logger } from "../../pkg/logger";
import { database } from "./database";
import { httpServer } from "./server";
export class DI {
    protected injections: Map<String, unknown> = new Map();

    readonly logger = logger;

    readonly Database = database;
    readonly HttpServer = httpServer;

    constructor() {
        this.injections = new Map();
    }

    private get<T = unknown>(key: string) {
        return this.injections.get(key) as T;
    }

    private has(key: string): boolean {
        return this.injections.has(key);
    }

    protected set<T = unknown>(key: string, value: T): T {
        if (this.has(key)) {
            return this.get(key) as T;
        }

        this.injections.set(key, value);

        this.logger.info(`Injected ${key} into DI`);

        return value;
    }
}
