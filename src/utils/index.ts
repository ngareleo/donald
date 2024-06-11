export function stringToBoolean(str: string | undefined | null): boolean {
  return typeof str === "string" && str.toLowerCase() === "true";
}
