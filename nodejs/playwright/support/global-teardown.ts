import { FullConfig } from "@playwright/test";


export default async function globalTeardown(config: FullConfig) {
  saveResults(config);
}

function saveResults(config: FullConfig): void {
  let reporters = config.reporter;
  const [, conf] = reporters.find(
    ([path]) => path.endsWith('json-reporter.ts')
  );
  // TODO: deal with conf.outputFile
}
