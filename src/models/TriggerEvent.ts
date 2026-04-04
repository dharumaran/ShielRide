export type TriggerEvent = {
  id: string;
  type: string;
  city: string;
  evaluatedAt: number;
  outcome: "FIRED" | "NOT_FIRED" | "PENDING";
  workersAffected: number;
  detail: string;
};
