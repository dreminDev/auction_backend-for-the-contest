import type { User } from "../../../model/user";

export type CreateUserIn = Omit<User, "addedAt">;
