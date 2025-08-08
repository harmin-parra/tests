export function getBrowserName(): string {
  const arg = process.argv.find(a => a.startsWith("--browser="));
  if (!arg)
    return "firefox";
  let value = arg.split("=")[1].toLowerCase();
  const supported = ["chrome", "firefox", "edge", "chromium"];
  if (!supported.includes(value))
    value = "firefox";
  return value;
}


export function getHeadlessOption(): boolean {
  return process.argv.includes("--headless");
}
