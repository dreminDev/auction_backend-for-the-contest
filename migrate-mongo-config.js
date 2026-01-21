import dotenv from "dotenv";

dotenv.config();

const config = {
    mongodb: {
        url: process.env.DATABASE_URL,
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
