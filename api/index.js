export default async function handler(req, res) {
  // CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Preflight CORS kontrolü
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const id = parseInt(req.query.id);
  if (!id || isNaN(id) || id < 1) {
    return res.status(400).send("Geçersiz veya eksik ID.");
  }

  const m3uUrl = "https://raw.githubusercontent.com/atakan1983/kabloo/refs/heads/main/mehmet.m3u";

  try {
    const response = await fetch(m3uUrl);
    const text = await response.text();
    const lines = text.split("\n").filter(line => line.trim() !== "");

    const index = id * 2 - 1;
    const streamUrl = lines[index];

    if (!streamUrl || !streamUrl.startsWith("http")) {
      return res.status(404).send("Yayın bağlantısı bulunamadı.");
    }

    // Redirect ile yayını yönlendir
    return res.redirect(302, streamUrl);
  } catch (err) {
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
}
