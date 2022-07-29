import { parseHTML } from "linkedom";
import fetch from "node-fetch";
import htmlToBB from "../../lib/html-to-bb.js";

/**
 * @param {import("@vercel/node").VercelRequest} req
 * @param {import("@vercel/node").VercelResponse} res
 * @returns {void}
 */
export default async function (req, res) {
  res.json(await (await fetch(`https://api.scratch.mit.edu/users/${req.query.u}`)).json()).end();
}
