import { type Page } from "@playwright/test";
import { Junit } from "./junit-utils";
import * as allure from "allure-js-commons";
import { Attach } from "./allure-utils";


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
