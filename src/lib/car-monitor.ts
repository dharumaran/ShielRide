/**
 * CAR = Pool_Capital_₹ / Total_Expected_Loss_₹
 */

export type CarStatus =
  | "stable"
  | "monitor"
  | "alert"
  | "critical_pause";

export function computeCar(
  poolCapital: number,
  totalExpectedLoss: number
): { car: number; status: CarStatus; message: string; premiumBumpPct: number } {
  if (totalExpectedLoss <= 0) {
    return {
      car: Infinity,
      status: "stable",
      message: "No expected loss — CAR not applicable",
      premiumBumpPct: 0,
    };
  }
  const car = poolCapital / totalExpectedLoss;
  if (car >= 1.5) {
    return {
      car,
      status: "stable",
      message: "Stable. No adjustment.",
      premiumBumpPct: 0,
    };
  }
  if (car >= 1.2) {
    return {
      car,
      status: "monitor",
      message: "Monitor. Flag α increase.",
      premiumBumpPct: 0,
    };
  }
  if (car >= 1.0) {
    return {
      car,
      status: "alert",
      message: "Alert. +10% premiums.",
      premiumBumpPct: 10,
    };
  }
  return {
    car,
    status: "critical_pause",
    message: "Critical. Pause new policies.",
    premiumBumpPct: 10,
  };
}
