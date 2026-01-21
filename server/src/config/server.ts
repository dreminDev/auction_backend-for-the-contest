export function httpCorsConfig() {
    return {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "user-id", "Authorization"],
        credentials: false,
    };
}
