import { logger } from "../../pkg/logger";
import { database } from "./database";

/* Dependency Injection container*/
export class DI {
    protected injections: Map<String, unknown> = new Map();

    protected logger = logger;

    Database = database;

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

        this.logger.info(`Setting ${key} in DI`);

        this.injections.set(key, value);

        return value;
    }
}
