export type SplitSupplyByRoundsIn = {
    totalSupply: number;
    rounds: number;
};

export function splitSupplyByRounds(
    input: SplitSupplyByRoundsIn
): number[] {
    const baseAmount = Math.floor(input.totalSupply / input.rounds);
    const remainder = input.totalSupply % input.rounds;

    const result = Array(input.rounds).fill(baseAmount);

    for (let i = 0; i < remainder; i++) {
        result[i] += 1;
    }

    if (input.rounds === 1) {
        return [input.totalSupply];
    }

    return result;
}
