import type { RegisterUserIn } from "./dto/register";
import type { UserService } from "./service";

export async function registerUser(this: UserService, input: RegisterUserIn) {
    const [fetchUser, fetchUserBalance] = await Promise.all([
        this.userRepo.fetchUser({ userId: input.userId }),
        this.balanceRepo.fetchBalance({ userId: input.userId }),
    ]);

    if (fetchUser && fetchUserBalance) {
        throw new Error("User already registered");
    }

    if (!fetchUser) {
        await this.userRepo.createUser({
            userId: input.userId,
            username: null,
            first_name: null,
            last_name: null,
        });
    }
}
