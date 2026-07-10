export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 23) return "Good evening";
  return "Are you staying up late?";
}
