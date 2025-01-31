import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

async function checkScriptExists(
  url: string,
  scriptSrc: string,
  chatbotId: string
): Promise<boolean> {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Look for a script tag with the specific src and data-chatbot-id
    const scriptExists =
      $(`script[src="${scriptSrc}"][data-chatbot-id="${chatbotId}"]`).length >
      0;

    return scriptExists;
  } catch (error) {
    console.error("Error checking script:", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let {
    url,
    scriptSrc = "https://talkbot-ai-new.vercel.app/chatbot-widget.js",
    chatbotId,
  } = req.body;

  try {
    let result = await checkScriptExists(url, scriptSrc, chatbotId);
    return res.status(200).json({ success: result });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ success: false });
  }
}
