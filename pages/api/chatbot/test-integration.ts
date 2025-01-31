import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

async function checkElementExists(
  url: string,
  elementId: string
): Promise<boolean> {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    return $(`#${elementId}`).length > 0;
  } catch (error) {
    console.error("Error checking element:", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { url, id } = req.body;

  try {
    let result = await checkElementExists(url, id);
    return res.status(200).json({ success: result });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ success: false });
  }
}
