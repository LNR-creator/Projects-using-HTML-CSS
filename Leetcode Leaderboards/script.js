// Replace with your Google Sheet ID.
const sheetId = "1Mfc0hDD7wOzIFPcl6SvZurYaBhcT2QDgWnDDoWMYjlo"; 
// The name of the tab in your sheet.
const sheetName = "Leaderboards"; 

// CORRECTED URL: This uses the Google Visualization API to get the data as JSON.
const apiUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

fetch(apiUrl)
  .then(res => res.text())
  .then(text => {
    // The response is JSONP. We need to strip the prefix to get valid JSON.
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    const students = rows.map(row => ({
      // Assumes your sheet columns are: A=Name, B=LeetCode URL, C=GFG URL, D=Problems Solved
      name: row.c[0]?.v ?? "N/A",
      leetcode: row.c[1]?.v ?? "#",
      gfg: row.c[2]?.v ?? "#",      
      problems: row.c[3]?.v ?? 0, 
    }));

    // Sort students by the number of problems solved in descending order.
    students.sort((a, b) => b.problems - a.problems);

    const tbody = document.querySelector("#leaderboard tbody");
    let tableHtml = "";

    students.forEach(s => {
      tableHtml += `
        <tr>
          <td>${s.name}</td>
          <td>${s.problems}</td>
          <td><a href="${s.leetcode}" target="_blank">LeetCode</a></td>
          <td><a href="${s.gfg}" target="_blank">GFG</a></td>
        </tr>`;
    });

    tbody.innerHTML = tableHtml;
  })
  .catch(err => {
      console.error("Error fetching data:", err);
      const tbody = document.querySelector("#leaderboard tbody");
      tbody.innerHTML = `<tr><td colspan="4">Error: Could not load data. Please check the Sheet ID and ensure the sheet is public.</td></tr>`;
  });