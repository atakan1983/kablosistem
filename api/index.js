export default async function handler(req, res) {
  const kanal = req.query.kanal;
  if (!kanal) return res.status(400).send("Kanal adı belirtilmedi");

  const url = "https://raw.githubusercontent.com/atakan1983/kabloo/refs/heads/main/mehmet.m3u";

  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(kanal.toLowerCase())) {
        const streamUrl = lines[i + 1]?.trim();
        if (streamUrl && streamUrl.startsWith("http")) {
          return res.redirect(302, streamUrl);
        }
      }
    }

    return res.status(404).send("Kanal bulunamadı.");
  } catch (err) {
    return res.status(500).send("Sunucu hatası.");
  }
}
