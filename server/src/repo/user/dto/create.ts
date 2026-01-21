import type { User } from "@prisma/client";

export type CreateUserIn = Omit<User, "id" | "addedAt">;
