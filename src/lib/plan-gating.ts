export function isAILocked(plan?: string | null): boolean {
  return !plan || plan === "start";
}

export const AI_ROUTES = [
  "/admin/ai/itinerarios",
  "/admin/ai/chatbot",
  "/admin/ai/asistente",
];
