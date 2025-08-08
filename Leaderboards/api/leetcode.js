export default async function handler(req, res) {
    const { username } = req.query;
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        username
                        submitStats: submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                    }
                }`,
                variables: { username }
            })
        });

        const json = await response.json();
        if (!json.data.matchedUser) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const stats = json.data.matchedUser.submitStats.acSubmissionNum;
        res.status(200).json({
            status: "success",
            username: json.data.matchedUser.username,
            totalSolved: stats[0].count,
            easySolved: stats[1].count,
            mediumSolved: stats[2].count,
            hardSolved: stats[3].count
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
}
