type DecimalInteger = {
    value: number;
    exp: number;
};

class decimal {
    private internal: string;
    private asInt: DecimalInteger;

    constructor(number: number | undefined | bigint | string) {
        if (number === undefined || number === null) {
            throw new Error("number is required");
        }

        this.internal = String(number);
        this.asInt = this.asInteger(this.internal);
    }

    private asInteger(number: string): DecimalInteger {
        const DECIMAL_SEPARATOR = ".";
        const tokens = number.split(DECIMAL_SEPARATOR);
        const integer = tokens[0] || "";
        const fractional = tokens[1];

        if (!fractional) {
            const trailingZeros = integer.match(/0+$/);
            if (trailingZeros && trailingZeros[0]) {
                const length = trailingZeros[0].length;
                const value = integer.substring(0, integer.length - length);
                return {
                    value: parseInt(value || "0", 10),
                    exp: length,
                };
            } else {
                return {
                    value: parseInt(integer || "0", 10),
                    exp: 0,
                };
            }
        } else {
            const value = parseInt(number.split(DECIMAL_SEPARATOR).join(""), 10);
            return {
                value: value,
                exp: fractional.length * -1,
            };
        }
    }

    private formatDecimal(num: string, exp: number): string {
        if (exp >= 0) {
            return this.posExp(num, exp);
        } else {
            return this.negExp(num, Math.abs(exp));
        }
    }

    private negExp(str: string, position: number): string {
        const DECIMAL_SEPARATOR = ".";
        const offset = position - str.length;

        if (offset >= 0) {
            str = this.zero(offset) + str;
            return "0." + str;
        }

        const length = str.length;
        const head = str.substring(0, length - position);
        const tail = str.substring(length - position, length);
        return head + DECIMAL_SEPARATOR + tail;
    }

    private posExp(str: string, exp: number): string {
        const zeros = this.zero(exp);
        return String(str + zeros);
    }

    private zero(count: number): string {
        return "0".repeat(count);
    }

    add(target: number | string | decimal): decimal {
        const targetDecimal = target instanceof decimal ? target : new decimal(target);
        const operands: decimal[] = [this, targetDecimal];
        operands.sort((x, y) => x.asInt.exp - y.asInt.exp);

        const smallest = operands[0]!.asInt.exp;
        const biggest = operands[1]!.asInt.exp;

        const x = Number(this.formatDecimal(String(operands[1]!.asInt.value), biggest - smallest));
        const y = Number(operands[0]!.asInt.value);

        const result = String(x + y);
        return new decimal(this.formatDecimal(result, smallest));
    }

    sub(target: number | string | decimal): decimal {
        const targetNum = target instanceof decimal ? target.toNumber() : Number(target);
        return this.add(targetNum * -1);
    }

    mul(target: number | string | decimal): decimal {
        const targetDecimal = target instanceof decimal ? target : new decimal(target);
        const result = String(this.asInt.value * targetDecimal.asInt.value);
        const exp = this.asInt.exp + targetDecimal.asInt.exp;

        return new decimal(this.formatDecimal(result, exp));
    }

    div(target: number | string | decimal): decimal {
        const targetDecimal = target instanceof decimal ? target : new decimal(target);
        const smallest = Math.min(this.asInt.exp, targetDecimal.asInt.exp);

        const x = new decimal(this.toNumber() * Math.pow(10, Math.abs(smallest)));
        const y = new decimal(targetDecimal.toNumber() * Math.pow(10, Math.abs(smallest)));

        return new decimal(x.toNumber() / y.toNumber());
    }

    toString(): string {
        return this.internal;
    }

    toNumber(): number {
        return Number(this.internal);
    }

    formatToTwoDecimals(): string {
        return parseFloat(this.internal).toFixed(2);
    }

    formatNumberWithSeparators(locale: string = "ru-RU"): string {
        return new Intl.NumberFormat(locale).format(this.toNumber());
    }

    // Статические методы для удобства
    static add(a: number | string | bigint, b: number | string | bigint): decimal {
        const aNum = new decimal(a);
        const bNum = new decimal(b);
        return aNum.add(bNum);
    }

    static sub(a: number | string | bigint, b: number | string | bigint): decimal {
        const aNum = new decimal(a);
        const bNum = new decimal(b);
        return aNum.sub(bNum);
    }

    static mul(a: number | string | bigint, b: number | string | bigint): decimal {
        const aNum = new decimal(a);
        const bNum = new decimal(b);
        return aNum.mul(bNum);
    }

    static div(a: number | string | bigint, b: number | string | bigint): decimal {
        const aNum = new decimal(a);
        const bNum = new decimal(b);
        return aNum.div(bNum);
    }
}

export default decimal;
