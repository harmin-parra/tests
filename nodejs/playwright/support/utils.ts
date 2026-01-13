import { type Page } from "@playwright/test";
import { Junit } from "./junit-utils";
import * as allure from "allure-js-commons";


export function typeOf(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export async function sleep(delay: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, delay));
}

export async function getCaseid(title: string): Promise<string> {
  const regex = /-\s*C(\d+)$/;
  const match = title.match(regex);
  const caseid: string = match ? match[1] : '0';
  if (caseid != '0') {
    await allure.tag('C' + caseid);
    await allure.tms(caseid);
  }
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
  let refs: string[] = await getTestCaseReferences(caseid);
  for( const ref of refs)
    await allure.issue(ref);
  await Junit.annotation_issues(refs);
}

export async function logLastScreenshot(page: Page, caseid: number | string = 0) {
  const screenshotPath = await Attach.lastScreenshot(page, caseid);
  await Junit.annotation_attachment(screenshotPath);
}

export async function logInfo(
  info: {
    firstname?: string,
    lastname?: string,
    phone?: string,
    email?: string,
    clientGuid?: string,
    propertyGuid?: string,
    propertyType?: string,
    projectGuid?: string,
    projectType?: string
  }, filename: string = null
): Promise<void> {
  let log = "";
  if (info?.firstname) {
    appendLineToFile(filename, "firstname=" + info.firstname);
    log += "firstname: " + info.firstname + '\n';
  }
  if (info?.lastname) {
    appendLineToFile(filename, "lastname=" + info.lastname);
    log += "lastname: " + info.lastname + '\n';
  }
  if (info?.phone && info.phone) {
    appendLineToFile(filename, "phone=" + info.phone);
    log += "phone: " + info.phone + '\n';
  }
  if (info?.email && info.email) {
    appendLineToFile(filename, "email=" + info.email);
    log += "email: " + info.email + '\n';
  }
  if (info?.clientGuid) {
    appendLineToFile(filename, "contact=" + info.clientGuid);
    log += "contact: " + info.clientGuid + '\n';
  }
  if (info?.propertyGuid) {
    appendLineToFile(filename, "property=" + info.propertyGuid);
    log += "property: " + info.propertyGuid + '\n';
  }
  if (info?.projectGuid) {
    appendLineToFile(filename, "project=" + info.projectGuid);
    log += "project: " + info.projectGuid + '\n';
  }
  if (info?.propertyType) {
    appendLineToFile(filename, "type_property=" + info.propertyType);
  }
  if (info?.projectType) {
    appendLineToFile(filename, "type_project=" + info.projectType);
  }
  if (log != "")
    Attach.text("Logged info", log);
}
