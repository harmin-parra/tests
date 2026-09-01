// Graph REST API doc for Mail
// https://learn.microsoft.com/en-us/graph/api/resources/message?view=graph-rest-1.0

import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { htmlToText } from "html-to-text";
import "isomorphic-fetch";


export interface MailMessage {
  from: {
    name: string,
    address: string
  },
  subject: string,
  date: Date,
  body: {
    text: string,
    html: string
  }
}


function createMailMessage(): MailMessage {
  let obj: MailMessage = {
    from: { name: null, address: null },
    subject: null,
    date: null,
    body: { text: null, html: null }
  };
  return obj as MailMessage;
}


// Azure app info
const tenantId = "xxx";
const clientId = "xxx";
const clientSecret = "xx";

// User email you want to read
const userEmail = "user@outlook.com";

// Authenticate with Microsoft Graph
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

async function getAccessToken() {
  const tokenResponse = await credential.getToken("https://graph.microsoft.com/.default");
  return tokenResponse.token;
}


// Create Graph client
async function getGraphClient() {
  const token = await getAccessToken();
  const client = Client.init({
    authProvider: (done) => {
      done(null, token);
    },
  });
  return client;
}


// Read email(s)
export async function readEmails(count: number = 1): Promise<MailMessage[]> {
  let messages: MailMessage[] = [];

  try {
    const client = await getGraphClient();

    const res = await client
      .api(`/users/${userEmail}/mailFolders/Inbox/messages`)
      .top(count)
      .select("id,subject,from,receivedDateTime,body,bodyPreview,isRead")
      .orderby("receivedDateTime DESC")
      .get();

    res.value.forEach((mail: any, index: number) => {
      const textContent = htmlToText(mail.body.content, {
        wordwrap: false,
        selectors: [
          { selector: "img", format: "skip" },
          { selector: "style", format: "skip" },
          { selector: "script", format: "skip" },
          //{ selector: "a", format: "inlineString", options: { string: "[Link]"} },
          //{ selector: "a", options: { hideLinkHrefIfSameAsText: true } }
          { selector: "a", options: { ignoreHref: true } }
        ]
      });
      let message: MailMessage = createMailMessage();
      message.from.name = mail.from.emailAddress.name;
      message.from.address = mail.from.emailAddress.address;
      message.subject = mail.subject;
      message.date = new Date(mail.receivedDateTime);
      message.body.html = mail.body.content;
      message.body.text = textContent;

      messages.push(message);
    });
    // Mark messages as read
    for (const mail of res.value) {
      await client
        .api(`/users/${userEmail}/messages/${mail.id}`)
        .patch({ isRead: true });
    }
  } catch (err) {
    console.error("Error reading emails: ", err);
    throw err;
  }
  return messages;
}


export async function getInboxCount(): Promise<number[]> {
  const client = await getGraphClient();
  const inbox = await client.api(`/users/${userEmail}/mailFolders/Inbox`).get();
  return [inbox.totalItemCount, inbox.unreadItemCount];
}
