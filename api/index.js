export default async function handler(req, res) {
  const id = parseInt(req.query.id);
  if (!id) return res.status(400).send("Geçersiz ID");

  const url = "https://raw.githubusercontent.com/atakan1983/kabloo/refs/heads/main/mehmet.m3u";

  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split("\n");

    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXTINF")) {
        count++;
        if (count === id && lines[i + 1]) {
          const streamUrl = lines[i + 1].trim();
          return res.redirect(302, streamUrl);
        }
      }
    }

    return res.status(404).send("Kanal bulunamadı.");
  } catch (err) {
    return res.status(500).send("Sunucu hatası.");
  }
}
