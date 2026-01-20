import type { UserRepo } from "./repo";

import type { CreateUserIn } from "../dto/create";
import type { FetchUserOut } from "../dto/fetch";

export async function createUser(
    this: UserRepo,
    input: CreateUserIn
): Promise<FetchUserOut> {
    const newUser = await this.db.user.create({
        data: {
            userId: input.userId,
            username: input.username ?? null,
            first_name: input.first_name ?? null,
            last_name: input.last_name ?? null,
        },
    });

    return newUser;
}
