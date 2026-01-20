import { describe, expect, it } from "bun:test";

import decimal from "./index";

describe("decimal", () => {
    describe("constructor", () => {
        it("should create instance from number", () => {
            const d = new decimal(123);
            expect(d.toString()).toBe("123");
            expect(d.toNumber()).toBe(123);
        });

        it("should create instance from string", () => {
            const d = new decimal("123.45");
            expect(d.toString()).toBe("123.45");
            expect(d.toNumber()).toBe(123.45);
        });

        it("should create instance from bigint", () => {
            const d = new decimal(BigInt(123));
            expect(d.toString()).toBe("123");
            expect(d.toNumber()).toBe(123);
        });

        it("should throw error for undefined", () => {
            expect(() => new decimal(undefined as any)).toThrow(
                "number is required"
            );
        });

        it("should throw error for null", () => {
            expect(() => new decimal(null as any)).toThrow(
                "number is required"
            );
        });
    });

    describe("add", () => {
        it("should add two numbers", () => {
            const d1 = new decimal(10);
            const result = d1.add(5);
            expect(result).toBeInstanceOf(decimal);
            expect(result.toNumber()).toBe(15);
        });

        it("should add decimal numbers", () => {
            const d1 = new decimal(10.5);
            const result = d1.add(5.25);
            expect(result.toNumber()).toBe(15.75);
        });

        it("should add with string", () => {
            const d1 = new decimal(10);
            const result = d1.add("5");
            expect(result.toNumber()).toBe(15);
        });

        it("should add with decimal instance", () => {
            const d1 = new decimal(10);
            const d2 = new decimal(5);
            const result = d1.add(d2);
            expect(result.toNumber()).toBe(15);
        });

        it("should handle precise decimal addition", () => {
            const d1 = new decimal(0.1);
            const result = d1.add(0.2);
            expect(result.toNumber()).toBeCloseTo(0.3, 10);
        });

        it("should support method chaining", () => {
            const result = new decimal(10)
                .add(5)
                .formatNumberWithSeparators();
            expect(result).toBe("15");
        });
    });

    describe("sub", () => {
        it("should subtract two numbers", () => {
            const d1 = new decimal(10);
            const result = d1.sub(5);
            expect(result).toBeInstanceOf(decimal);
            expect(result.toNumber()).toBe(5);
        });

        it("should subtract decimal numbers", () => {
            const d1 = new decimal(10.5);
            const result = d1.sub(5.25);
            expect(result.toNumber()).toBe(5.25);
        });

        it("should subtract with string", () => {
            const d1 = new decimal(10);
            const result = d1.sub("5");
            expect(result.toNumber()).toBe(5);
        });

        it("should subtract with decimal instance", () => {
            const d1 = new decimal(10);
            const d2 = new decimal(5);
            const result = d1.sub(d2);
            expect(result.toNumber()).toBe(5);
        });

        it("should handle negative results", () => {
            const d1 = new decimal(5);
            const result = d1.sub(10);
            expect(result.toNumber()).toBe(-5);
        });

        it("should support method chaining", () => {
            const result = new decimal(10)
                .sub(5)
                .formatNumberWithSeparators();
            expect(result).toBe("5");
        });
    });

    describe("mul", () => {
        it("should multiply two numbers", () => {
            const d1 = new decimal(10);
            const result = d1.mul(5);
            expect(result).toBeInstanceOf(decimal);
            expect(result.toNumber()).toBe(50);
        });

        it("should multiply decimal numbers", () => {
            const d1 = new decimal(10.5);
            const result = d1.mul(2);
            expect(result.toNumber()).toBe(21);
        });

        it("should multiply with string", () => {
            const d1 = new decimal(10);
            const result = d1.mul("5");
            expect(result.toNumber()).toBe(50);
        });

        it("should multiply with decimal instance", () => {
            const d1 = new decimal(10);
            const d2 = new decimal(5);
            const result = d1.mul(d2);
            expect(result.toNumber()).toBe(50);
        });

        it("should handle decimal multiplication", () => {
            const d1 = new decimal(0.1);
            const result = d1.mul(0.2);
            expect(result.toNumber()).toBeCloseTo(0.02, 10);
        });
    });

    describe("div", () => {
        it("should divide two numbers", () => {
            const d1 = new decimal(10);
            const result = d1.div(5);
            expect(result).toBeInstanceOf(decimal);
            expect(result.toNumber()).toBe(2);
        });

        it("should divide decimal numbers", () => {
            const d1 = new decimal(10.5);
            const result = d1.div(2);
            expect(result.toNumber()).toBe(5.25);
        });

        it("should divide with string", () => {
            const d1 = new decimal(10);
            const result = d1.div("5");
            expect(result.toNumber()).toBe(2);
        });

        it("should divide with decimal instance", () => {
            const d1 = new decimal(10);
            const d2 = new decimal(5);
            const result = d1.div(d2);
            expect(result.toNumber()).toBe(2);
        });

        it("should handle decimal division", () => {
            const d1 = new decimal(1);
            const result = d1.div(3);
            expect(result.toNumber()).toBeCloseTo(0.3333333333, 5);
        });
    });

    describe("toString", () => {
        it("should return string representation", () => {
            const d = new decimal(123.45);
            expect(d.toString()).toBe("123.45");
        });

        it("should return string for integer", () => {
            const d = new decimal(123);
            expect(d.toString()).toBe("123");
        });
    });

    describe("toNumber", () => {
        it("should return number representation", () => {
            const d = new decimal(123.45);
            expect(d.toNumber()).toBe(123.45);
        });

        it("should return number for integer", () => {
            const d = new decimal(123);
            expect(d.toNumber()).toBe(123);
        });
    });

    describe("formatToTwoDecimals", () => {
        it("should format to 2 decimal places", () => {
            const d = new decimal(123.456);
            expect(d.formatToTwoDecimals()).toBe("123.46");
        });

        it("should format integer to 2 decimal places", () => {
            const d = new decimal(123);
            expect(d.formatToTwoDecimals()).toBe("123.00");
        });

        it("should format small decimal", () => {
            const d = new decimal(0.1);
            expect(d.formatToTwoDecimals()).toBe("0.10");
        });
    });

    describe("formatNumberWithSeparators", () => {
        it("should format number with separators", () => {
            const d = new decimal(1234567.89);
            expect(d.formatNumberWithSeparators()).toBe(
                "1\u00a0234\u00a0567,89"
            );
        });

        it("should format with default locale", () => {
            const d = new decimal(1000);
            const result = d.formatNumberWithSeparators();
            expect(result).toContain("1");
        });

        it("should format with custom locale", () => {
            const d = new decimal(1234567.89);
            const result = d.formatNumberWithSeparators("en-US");
            expect(result).toBe("1,234,567.89");
        });
    });

    describe("method chaining", () => {
        it("should chain add and format", () => {
            const result = new decimal(10).add(5).formatToTwoDecimals();
            expect(result).toBe("15.00");
        });

        it("should chain sub and format", () => {
            const result = new decimal(10).sub(5).formatToTwoDecimals();
            expect(result).toBe("5.00");
        });

        it("should chain mul and format", () => {
            const result = new decimal(10).mul(5).formatToTwoDecimals();
            expect(result).toBe("50.00");
        });

        it("should chain div and format", () => {
            const result = new decimal(10).div(5).formatToTwoDecimals();
            expect(result).toBe("2.00");
        });

        it("should chain multiple operations", () => {
            const result = new decimal(10)
                .add(5)
                .mul(2)
                .sub(10)
                .formatToTwoDecimals();
            expect(result).toBe("20.00");
        });

        it("should chain static methods", () => {
            const result = decimal.sub(10, 5).formatNumberWithSeparators();
            expect(result).toBe("5");
        });
    });

    describe("static methods", () => {
        describe("static add", () => {
            it("should add two numbers", () => {
                const result = decimal.add(10, 5);
                expect(result).toBeInstanceOf(decimal);
                expect(result.toNumber()).toBe(15);
            });

            it("should add with strings", () => {
                const result = decimal.add("10", "5");
                expect(result.toNumber()).toBe(15);
            });

            it("should add with bigint", () => {
                const result = decimal.add(BigInt(10), BigInt(5));
                expect(result.toNumber()).toBe(15);
            });
        });

        describe("static sub", () => {
            it("should subtract two numbers", () => {
                const result = decimal.sub(10, 5);
                expect(result).toBeInstanceOf(decimal);
                expect(result.toNumber()).toBe(5);
            });

            it("should subtract with strings", () => {
                const result = decimal.sub("10", "5");
                expect(result.toNumber()).toBe(5);
            });
        });

        describe("static mul", () => {
            it("should multiply two numbers", () => {
                const result = decimal.mul(10, 5);
                expect(result).toBeInstanceOf(decimal);
                expect(result.toNumber()).toBe(50);
            });

            it("should multiply with strings", () => {
                const result = decimal.mul("10", "5");
                expect(result.toNumber()).toBe(50);
            });
        });

        describe("static div", () => {
            it("should divide two numbers", () => {
                const result = decimal.div(10, 5);
                expect(result).toBeInstanceOf(decimal);
                expect(result.toNumber()).toBe(2);
            });

            it("should divide with strings", () => {
                const result = decimal.div("10", "5");
                expect(result.toNumber()).toBe(2);
            });
        });
    });

    describe("edge cases", () => {
        it("should handle zero", () => {
            const d = new decimal(0);
            expect(d.toNumber()).toBe(0);
            expect(d.add(5).toNumber()).toBe(5);
            expect(d.sub(5).toNumber()).toBe(-5);
        });

        it("should handle negative numbers", () => {
            const d = new decimal(-10);
            expect(d.toNumber()).toBe(-10);
            expect(d.add(5).toNumber()).toBe(-5);
            expect(d.sub(5).toNumber()).toBe(-15);
        });

        it("should handle very small decimals", () => {
            const d1 = new decimal(0.001);
            const d2 = new decimal(0.002);
            const result = d1.add(d2);
            expect(result.toNumber()).toBeCloseTo(0.003, 10);
        });

        it("should handle large numbers", () => {
            const d = new decimal(999999999);
            expect(d.toNumber()).toBe(999999999);
        });
    });
});
