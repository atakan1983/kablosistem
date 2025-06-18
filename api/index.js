export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const id = parseInt(req.query.id);
  if (isNaN(id)) return res.status(400).send("Geçersiz ID");

  const url = "https://raw.githubusercontent.com/atakan1983/kabloo/main/mehmet.m3u";

  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split("\n").filter(line => line.trim() !== "");

    const index = id * 2 - 1;
    if (index >= lines.length) {
      return res.status(404).send("Kanal bulunamadı");
    }

    const streamUrl = lines[index];
    if (!streamUrl.startsWith("http")) {
      return res.status(500).send("Geçersiz yayın bağlantısı");
    }

    return res.redirect(302, streamUrl);
  } catch (err) {
    return res.status(500).send("Sunucu hatası");
  }
}
