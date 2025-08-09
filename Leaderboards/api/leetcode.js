// api/leetcode.js
// Vercel / Netlify serverless function style.
// Purpose: call LeetCode GraphQL from server-side (no CORS) and return parsed counts

export default async function handler(req, res) {
  try {
    const username = (req.query?.username || req.body?.username || "").trim();
    if (!username) return res.status(400).json({ error: "Username required" });

    const graphqlQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username },
    };

    // Use global fetch (available on Vercel); if your environment needs node-fetch, install & import it.
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphqlQuery),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return res.status(r.status).json({ error: `Upstream HTTP ${r.status}`, details: text });
    }

    const json = await r.json();
    const mu = json?.data?.matchedUser;
    if (!mu) {
      return res.status(404).json({ error: "User not found" });
    }

    const ac = mu.submitStats?.acSubmissionNum || [];
    // map difficulties to counts, fall back to 0
    const counts = {};
    ac.forEach(item => {
      counts[item.difficulty] = Number(item.count || 0);
    });

    const easy = counts["Easy"] ?? counts["easy"] ?? 0;
    const medium = counts["Medium"] ?? counts["medium"] ?? 0;
    const hard = counts["Hard"] ?? counts["hard"] ?? 0;
    // some responses include "All" as total; otherwise sum them
    const total = counts["All"] ?? (easy + medium + hard);

    // return a compact, frontend-friendly shape
    res.status(200).json({
      username: mu.username,
      easy,
      medium,
      hard,
      total,
    });
  } catch (err) {
    console.error("proxy error:", err);
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
}
