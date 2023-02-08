export class DateHelpers {
  public static daysInMs(days: number): number {
    return days * 24 * 60 * 60 * 1000;
  }

  public static dateBetween(min: Date, max: Date): Date {
    return new Date(min.getTime() + (Math.random() * (max.getTime() - min.getTime())));
  }
}
