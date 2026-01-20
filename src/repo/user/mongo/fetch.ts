import type { UserRepo } from "./repo";

import type { FetchUserIn } from "../dto/fetch";
import type { FetchUserOut } from "../dto/fetch";

export async function fetchUserById(
    this: UserRepo,
    input: FetchUserIn
): Promise<FetchUserOut> {
    const user = await this.db.user.findFirst({
        where: {
            userId: input.userId,
        },
    });

    if (!user) {
        return null;
    }

    return user;
}

