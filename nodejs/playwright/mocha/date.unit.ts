import assert from "node:assert";
import { formatDateHour, formatDate, dateFromDMY, getFutureDate, dateFromYMD_HM, sameDate } from "../support/date-utils";


describe("Date utils tests", function () {

  it("formatDateHour", function () {
    const date = new Date("2018-09-22T15:23:10");
    let date_str = formatDateHour(date);
    assert(date_str == "2018-09-22 15:23:10", "verifying " + date_str);
  });


  it("formatDate - param null", function () {
    let date_str = formatDate();
    console.log(date_str);
    // assert(date_str == "22/09/2018", "verifying " + date_str);
  });


  it("formatDate - param Date", function () {
    const date = new Date("2018-09-22T15:23:10");
    let date_str = formatDate(date);
    console.log(date_str);
    assert(date_str == "22/09/2018", "verifying " + date_str);
  });


  it("formatDate - param positive number", function () {
    let date_str = formatDate(30);
    console.log(date_str);
  });


  it("formatDate - param negative number", function () {
    let date_str = formatDate(-30);
    console.log(date_str);
  });


  it("dateFromDMY", function () {
    const date1: Date = new Date(2018, 8, 22);
    let date2: Date = dateFromDMY("22/09/2018");
    assert(date1.getTime() == date2.getTime(), `comparing '${date1}' vs '${date2}'`);
  });


  it("dateFromYMD_HM", function () {
    const date1: Date = new Date(2024, 10, 6, 10, 13);
    let date2: Date = dateFromYMD_HM("20241106-1013");
    assert(date1.getTime() == date2.getTime(), `comparing '${date1}' vs '${date2}'`);
  });


  it("getFutureDate", function () {
    const date1: Date = new Date();
    let date2: Date = getFutureDate(12);
    let difference = (date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000);
    assert(difference == 12, `comparing '${date1}' vs '${date2}'`);
  });

  it("Same date (date, date) - true", function () {
    const date1 = new Date("1995-12-17T03:24:00");
    const date2 = new Date("1995-12-17T00:10:00");
    assert(sameDate(date1, date2));
  });

  it("Same date (date, string) - true", function () {
    const date1 = new Date("1995-12-17T03:24:00");
    const date2 = "17/12/1995";
    assert(sameDate(date1, date2));
  });

  it("Same date (date, date) - false", function () {
    const date1 = new Date("1995-12-17T03:24:00");
    const date2 = new Date("1995-12-16T00:10:00");
    assert(!sameDate(date1, date2));
  });

  it("Same date (date, string) - false", function () {
    const date1 = new Date("1995-12-17T03:24:00");
    const date2 = "18/12/1995";
    assert(!sameDate(date1, date2));
  });
});
