import { type Page } from "@playwright/test";
import { Junit } from "./junit-utils";
import * as allure from "allure-js-commons";
import { Attach } from "./allure-utils";
import { getTestCaseFields, getTestCaseReferences } from "./testrail-utils";


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

export function getCaseid(title: string): string {
  const regex = /-\s*C(\d+)$/;
  const match = title.match(regex);
  return match ? match[1] : '0';
}

export function mergeObjects(obj1: any, obj2: any): any {
  return { ...obj1, ...obj2 };
}

export function mergeArrays(array1: any[], array2: any[]): any[] {
  return [...array1, ...array2];
}

export function belongToEnum<T extends Record<string, string | number>>(
  enumType: T,
  value: unknown
): value is T[keyof T] {
  return Object.values(enumType).includes(value as T[keyof T]);
}

export function extractLastUrlSegment(url: string) {
  return url.substring(url.lastIndexOf('/') + 1);
}

export function extractLastBeforeUrlSegment(url: string): string {
  const parts = url.split('/').filter(Boolean); // split and remove empty strings
  if (parts.length < 2) return null; // safety check
  return parts[parts.length - 2]; // second-to-last element
}

export function extractGuids(url: string): string[] {
  return url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
}

export async function addJiraReferences(caseid: number | string): Promise<void> {
  let refs: string[] = await getTestCaseReferences(caseid);
  for (const ref of refs)
    await allure.issue(ref);
  await Junit.annotation_issues(refs);
}

export async function addTestRailFields(caseid: number | string): Promise<void> {
  let fields: any = await getTestCaseFields(caseid);
  for (const ref of fields.refs)
    await allure.issue(ref);
}

export async function logLastScreenshot(page: Page, caseid: number | string = 0) {
  const screenshotPath = await Attach.lastScreenshot(page, caseid);
  await Junit.annotation_image(screenshotPath);
}
