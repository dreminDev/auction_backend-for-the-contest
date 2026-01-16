import type { UserRepo } from "./repo";

import type { CreateUserIn } from "../dto/create";
import type { FetchUserOut } from "../dto/fetch";

export async function createUser(
    this: UserRepo,
    input: CreateUserIn
): Promise<FetchUserOut> {
    const newUser = await this.userModel.create(input);

    return newUser;
}
