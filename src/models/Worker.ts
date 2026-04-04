export type Platform = "Zepto" | "Blinkit";

export type Worker = {
  id: string;
  name: string;
  phone: string;
  city: string;
  platform: Platform;
  vehicleType: string;
  dailyBaselineIncome: number;
  upiVpa: string;
  deviceFingerprint?: string;
  createdAt: string;
};
