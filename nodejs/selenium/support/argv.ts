export function getBrowserName(): string {
  const arg = process.argv.find(a => a.startsWith("--browser="));
  if (!arg)
    return "firefox";
  let value = arg.split("=")[1].toLowerCase();
  const supported = ["chrome", "firefox", "msedge", "edge", "chromium"];
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



export function getHubOption(): string {
  const arg = process.argv.find(a => a.startsWith("--hub="));
  if (!arg)
    return null;
  let hub = arg.split("=")[1].toLowerCase();
  return `http://${hub}:4444/wd/hub`;
}
