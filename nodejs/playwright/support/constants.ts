import fs from "node:fs";
import { DATE_FILE } from "./shared-variables";
import { dateFromYMD_HM } from "./date-utils";


export const DATE_LABEL = fs.readFileSync(DATE_FILE, "utf8").trim();
export const DATE_START = dateFromYMD_HM(DATE_LABEL);
