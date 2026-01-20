import { NotFoundError } from "../../error/customError";
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
        throw new NotFoundError("user not found");
    }
    if (balances.length === 0) {
        throw new NotFoundError("balances not found");
    }

    balances.forEach((balance: Record<string, any>) => {
        delete balance.userId;
        delete balance.id;
        delete balance.addedAt;
    });

    const out: FetchUserByIdOut = {
        user: user,
        balances: balances,
    };

    return out;
}
