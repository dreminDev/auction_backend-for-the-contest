import type { FetchUserIn, FetchUserOut } from "../dto/fetch";
import type { UserRepo } from "./repo";

export async function fetchUserById(this: UserRepo, input: FetchUserIn): Promise<FetchUserOut> {
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
