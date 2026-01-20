class TimeClass {
    /**
     * Convert milliseconds to milliseconds
     * @param milliseconds - milliseconds
     * @returns milliseconds
     */
    milliseconds(milliseconds: number): number {
        return milliseconds;
    }

    /**
     * Convert seconds to milliseconds
     * @param seconds - seconds
     * @returns milliseconds
     */
    second(seconds: number): number {
        return seconds * 1000;
    }

    /**
     * Convert minutes to milliseconds
     * @param minutes - minutes
     * @returns milliseconds
     */
    minute(minutes: number): number {
        return minutes * 60 * 1000;
    }

    /**
     * Convert hours to milliseconds
     * @param hours - hours
     * @returns milliseconds
     */
    hour(hours: number): number {
        return hours * 60 * 60 * 1000;
    }

    /**
     * Convert days to milliseconds
     * @param days - days
     * @returns milliseconds
     */
    day(days: number): number {
        return days * 24 * 60 * 60 * 1000;
    }

    /**
     * Convert weeks to milliseconds
     * @param weeks - weeks
     * @returns milliseconds
     */
    week(weeks: number): number {
        return weeks * 7 * 24 * 60 * 60 * 1000;
    }

    /**
     * Convert months to milliseconds
     * @param months - months
     * @returns milliseconds
     */
    month(months: number): number {
        return months * 30 * 24 * 60 * 60 * 1000;
    }

    /**
     * Convert years to milliseconds
     * @param years - years
     * @returns milliseconds
     */
    year(years: number): number {
        return years * 365 * 24 * 60 * 60 * 1000;
    }

    /**
     * Add milliseconds to a date
     * @param date - date
     * @param milliseconds - milliseconds
     * @returns date
     */
    add(date: Date, milliseconds: number): Date {
        return new Date(date.getTime() + milliseconds);
    }

    /**
     * Add milliseconds to the current date
     * @param milliseconds - milliseconds
     * @returns date
     */
    addNow(milliseconds: number): Date {
        return this.add(this.now(), milliseconds);
    }

    /**
     * Subtract milliseconds from a date
     * @param date - date
     * @param milliseconds - milliseconds
     * @returns date
     */
    sub(date: Date, milliseconds: number): Date {
        return new Date(date.getTime() - milliseconds);
    }

    /**
     * Subtract milliseconds from the current date
     * @param milliseconds - milliseconds
     * @returns date
     */
    subNow(milliseconds: number): Date {
        return this.sub(this.now(), milliseconds);
    }

    /**
     * Create a date
     * @param year - year
     * @param month - month
     * @param day - day
     * @param hour - hour
     * @param minute - minute
     * @param second - second
     * @param millisecond - millisecond
     * @returns date
     */
    date(
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number
    ): Date {
        return new Date(
            year,
            month,
            day,
            hour,
            minute,
            second,
            millisecond
        );
    }

    /**
     * Sleep for a given number of milliseconds
     * @param milliseconds - milliseconds
     * @returns Promise<void>
     */
    sleep(milliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    /**
     * Get the difference between two dates in milliseconds
     * @param date1 - date1
     * @param date2 - date2
     * @returns difference in milliseconds
     */
    diff(date1: Date, date2: Date): number {
        return date1.getTime() - date2.getTime();
    }

    /**
     * Get the current date
     * @returns date
     */
    now(): Date {
        return new Date();
    }
}

export const time = new TimeClass();
