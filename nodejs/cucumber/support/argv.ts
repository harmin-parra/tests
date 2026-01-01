export function getBrowserName(): string {
  const arg = process.argv.find(a => a.startsWith("--browser="));
  if (!arg)
    return "firefox";
  let value = arg.split("=")[1].toLowerCase();
  const supported = ["chrome", "firefox"];
  if (!supported.includes(value))
    value = "firefox";
  return value;
}


export function getHeadlessOption(): boolean {
  const arg = process.argv.find(a => a.startsWith("--headless="));
  if (!arg)
    return true;
  let value = arg.split("=")[1].toLowerCase();
  if (value === "false")
    return false;
  else
    return true;
}
