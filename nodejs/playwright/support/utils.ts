import { type Page } from "@playwright/test";
import { Junit } from "./junit-utils";
import * as allure from "allure-js-commons";
import { Attach } from "./allure-utils";
import { COUNTER_FILE, RUNTIME_FOLDER } from "./shared-variables";
import { DATE_LABEL } from "./constants";
import path from "node:path";
import fs from 'node:fs';


/*
function nextId(): number {
  const raw = fs.readFileSync(COUNTER_FILE, "utf8").trim();
  const current = parseInt(raw, 10);
  const next = current + 1;
  fs.writeFileSync(COUNTER_FILE, String(next));
  return current;
}

export function getNextSuffix(): string {
  return DATE_LABEL + '-' + nextId();
}
*/

export function typeOf(value: any): string {
  let result = Object.prototype.toString.call(value).slice(8, -1);
  if (result == "Object")
    return value.constructor.name;
  else
    return result;
}

export async function sleep(delay: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, delay));
}

export function appendLineToFile(filename: string = null, content: string) {
  if (filename && filename.length > 0) {
    const FILE = path.join(RUNTIME_FOLDER, filename);
    fs.writeFileSync(FILE, content + '\n', { flag: 'a' });
  }
}

export function readPropertyFile(filename: string): Record<string, string> {
  filename = path.join(RUNTIME_FOLDER, filename);
  const content = fs.readFileSync(filename, 'utf-8');
  const properties: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#'))
      continue;
    const [key, ...rest] = trimmed.split('=');
    properties[key.trim()] = rest.join('=').trim();
  }
  return properties;
}

export async function getCaseid(title: string): Promise<string> {
  const regex = /-\s*C(\d+)$/;
  const match = title.match(regex);
  const caseid: string = match ? match[1] : '0';
  if (caseid != '0')
    await allure.tms(caseid);
  return caseid;
}

export function extractLastUrlSegment(url: string) {
  return url.substring(url.lastIndexOf('/') + 1);
}

export function extractLastBeforeUrlSegment(url: string): string {
  const parts = url.split('/').filter(Boolean); // split and remove empty strings
  if (parts.length < 2) return null; // safety check
  return parts[parts.length - 2]; // second-to-last element
}

export async function addJiraReferences(caseid: number | string): Promise<void> {
  let refs: string[] = [];  // await getTestCaseReferences(caseid);
  for( const ref of refs)
    await allure.issue(ref);
  await Junit.annotation_issues(refs);
}

export async function logLastScreenshot(page: Page, caseid: number | string = 0) {
  const screenshotPath = await Attach.lastScreenshot(page, caseid);
  await Junit.annotation_attachment(screenshotPath);
}
