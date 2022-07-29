import { parseHTML } from "linkedom";
import fetch from "node-fetch";
import htmlToBB from "../../lib/html-to-bb.js";

/**
 * @param {import("@vercel/node").VercelRequest} req
 * @param {import("@vercel/node").VercelResponse} res
 * @returns {void}
 */
export default async function (req, res) {
  const { f = "31", accurateBB } = req.query;
  const fetchAccurateBB = typeof accurateBB === "string";
  const url = `https://scratch.mit.edu/discuss/feeds/forum/${f}/?t=${Date.now()}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    res.status(resp.status);
    return res
      .json({ error: "Could not fetch feed", type: "SCRATCH_ERROR" })
      .end();
  }
  const xml = await resp.text();
  const { document } = parseHTML(xml);
  const posts = [...document.querySelectorAll("entry")].reverse();
  let data = posts.map((post) => ({
    id: Number(post.querySelector("id")?.textContent),
    author: post.querySelector("author > name")?.textContent,
    date: post.querySelector("published")?.textContent,
    content: {
      html: Buffer.from(post.querySelector("summary")?.textContent).toString(
        "utf-8"
      ),
      bb: !fetchAccurateBB
        ? htmlToBB(
            Buffer.from(post.querySelector("summary")?.textContent).toString(
              "utf-8"
            ),
            document
          )
        : null,
    },
    topic: {
      title: post
        .querySelector("title")
        ?.textContent.replace(
          /(About Scratch|Scratch Around the World|Welcome to Scratch|Making Scratch Projects|Interests Beyond Scratch) :: (Suggestions|Bugs and Glitches|Questions about Scratch|Announcements|New Scratchers|Help with Scripts|Show and Tell|Project Ideas|Collaboration|Requests|Deutsch|Español|Français|中文|Polski|日本語|Nederlands|Português|Italiano|עברית|한국어|Norsk|Türkçe|Ελληνικά|Pусский|Translating Scratch|Things I'm Making and Creating|Things I'm Reading and Playing|Advanced Topics|Connecting to the Physical World|Català|Other Languages|Bahasa Indonesia|Developing Scratch Extensions|Open Source Projects|Africa|فارسی) :: (.*)\n/,
          "$3"
        ),
    },
  }));
  if (fetchAccurateBB) {
    const promises = data.map(async (post) => {
      const resp = await fetch(
        `https://scratch.mit.edu/discuss/post/${post.id}/source`
      );
      if (!resp.ok) {
        return post;
      }
      const source = await resp.text();
      post.content.bb = source;
      return post;
    });
    data = await Promise.all(promises);
  }
  res.json(data).end();
}
