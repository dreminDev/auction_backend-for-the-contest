import "dotenv/config";
import { defineConfig } from "prisma/config";

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoName = process.env.MONGO_NAME || "auction";

let url: string;
if (mongoUser && mongoPassword) {
    // Если есть учетные данные, используем аутентификацию
    // authSource указывает базу данных для аутентификации (обычно admin)
    // directConnection=true для прямого подключения без репликации
    console.log("Using authentication", mongoUser, mongoPassword, mongoName);
    url = `mongodb://${encodeURIComponent(mongoUser)}:${encodeURIComponent(mongoPassword)}@localhost:27017/${mongoName}?authSource=admin&replicaSet=rs0`;
    console.log("URL", url);
} else {
    // Если нет учетных данных, подключаемся без аутентификации
    url = `mongodb://localhost:27017/${mongoName}?replicaSet=rs0`;
}

export default defineConfig({
    datasource: {
        url: `mongodb://localhost:27017/${mongoName}?replicaSet=rs0`,
    },
});