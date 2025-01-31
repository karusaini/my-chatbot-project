// pages/api/proxy.js

export default async function handler(req, res) {
  try {
    const { url, elementId } = req.body; // Extract URL and elementId from the body
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the page");
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const elementExists = !!doc.getElementById(elementId);
    res.status(200).json({ elementExists });
  } catch (error) {
    console.error("Error checking element:", error);
    res.status(500).json({ error: "Failed to check element" });
  }
}
