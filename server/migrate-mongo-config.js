import dotenv from "dotenv";

dotenv.config({ override: false });

const config = {
    mongodb: {
        // Используем переменную окружения или fallback для Docker
        url: process.env.DATABASE_URL || "mongodb://mongodb:27017/auction",
        databaseName: "auction",
        options: {},
    },

    migrationsDir: "migrations",
    changelogCollectionName: "migrations",
    lockCollectionName: "migrations_lock",
    lockTtl: 0,
    migrationFileExtension: ".ts",
    useFileHash: false,
    moduleSystem: "esm",
};

export default config;
