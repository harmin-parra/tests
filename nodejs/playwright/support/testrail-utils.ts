import axios, { AxiosError } from 'axios';


const baseUrl = "https://www.jira.com/";
const username = "user";
const apiKey = "tocken";
const authToken = Buffer.from(`${username}:${apiKey}`).toString('base64');

/**
 * Return the JIRA tickets associated to a given test case.
 * @param caseid The TestRail case ID.
 */
export async function getTestCaseReferences(caseid: number | string): Promise<string[]> {
  const endpoint = `${baseUrl}/index.php?/api/v2/get_case/${caseid}`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.refs?.split(',') ?? [];
  } catch (err) {
    const error = err as AxiosError<any>;
    if (error.response)
      console.error(`TestRail API Error (${error.response.status}): ${error.response.data?.error ?? 'Unknown error'}`);
    else
      console.error('Network error when calling TestRest API');
    return [];
  }
}


/**
 * Return some test case fields from TestRail.
 * @param caseid The TestRail case ID.
 */
export async function getTestCaseFields(caseid: number | string): Promise<any> {
  const endpoint = `${baseUrl}/index.php?/api/v2/get_case/${caseid}`;
  let result: any = {
    refs: [],
    author: "",
    maintainer: "",
  }
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    result.refs = response.data.refs?.split(',') ?? [];
    result.author = response.data.custom_case_inital_author ?? "";
    result.maintainer = response.data.custom_case_maintainer ?? "";
  } catch (err) {
    const error = err as AxiosError<any>;
    if (error.response)
      console.error(`TestRail API Error (${error.response.status}): ${error.response.data?.error ?? 'Unknown error'}`);
    else
      console.error('Network error when calling TestRest API');
  } finally {
    return result;
  }
}
