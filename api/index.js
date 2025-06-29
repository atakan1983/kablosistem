export default async function handler(req, res) {
 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    const response = await fetch("https://raw.githubusercontent.com.m3u");
    const text = await response.text();
    const lines = text.split("\n");

    const kanalListesi = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/tvg-id="(\d+)"[^,]*,(.*)/);
      if (match) {
        kanalListesi.push({ id: match[1], name: match[2] });
      }
    }

    if (!id || isNaN(id) || !lines.some(l => l.includes(`tvg-id="${id}"`))) {
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Mevcut Kanallar</title>
            <style>
              body { font-family: sans-serif; background: #f9f9f9; padding: 1rem; }
              h1 { color: #333; text-align: center; }
              table { border-collapse: collapse; width: 100%; max-width: 600px; margin: auto; background: #fff; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #4CAF50; color: white; }
              tr:hover { background-color: #f1f1f1; }
              @media (max-width: 600px) {
                table, thead, tbody, th, td, tr { display: block; width: 100%; }
                th { display: none; }
                td { border: none; position: relative; padding-left: 50%; }
                td::before {
                  position: absolute;
                  top: 12px;
                  left: 12px;
                  width: 45%;
                  white-space: nowrap;
                  font-weight: bold;
                }
                td:nth-of-type(1)::before { content: "ID"; }
                td:nth-of-type(2)::before { content: "Kanal Adı"; }
              }
            </style>
          </head>
          <body>
            <h1>${id && !isNaN(id) ? "ID bulunamadı!" : "Geçersiz ID"}</h1>
            <h2 style="text-align:center;">Mevcut Kanallar</h2>
            <table>
              <thead>
                <tr><th>ID</th><th>Kanal Adı</th></tr>
              </thead>
              <tbody>
                ${kanalListesi.map(k => `<tr><td>${k.id}</td><td>${k.name}</td></tr>`).join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    }

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`tvg-id="${id}"`)) {
        const streamUrl = lines[i + 1];
        return res.redirect(streamUrl);
      }
    }

  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(`<h1>Sunucu hatası</h1><p>${error.message}</p>`);
  }
}
