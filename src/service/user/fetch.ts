
import type { FetchUserIn } from "../../repo/user/dto/fetch";
import type { FetchUserByIdOut } from "./dto/fetch";
import type { UserService } from "./service";

export async function fetchUserById(
    this: UserService,
    input: FetchUserIn
): Promise<FetchUserByIdOut> {
    const [user, balances] = await Promise.all([
        this.userRepo.fetchUserById(input),
        this.balanceService.fetchBalancesByUserId({
            userId: input.userId,
        }),
    ]);

    if (!user) {
        throw new Error("User not found");
    }
    if (balances.length === 0) {
        throw new Error("Balances not found");
    }

    const out: FetchUserByIdOut = {
        user: user,
        balances: balances,
    };

    return out;
}