
import type { FetchUserIn } from "../../repo/user/dto/fetch";
import type { FetchUserByIdOut } from "./dto/fetch";
import type { UserService } from "./service";

export async function fetchUserById(
    this: UserService,
    input: FetchUserIn
): Promise<FetchUserByIdOut> {
    const user = await this.userRepo.fetchUserById(input);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}