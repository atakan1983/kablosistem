import fetch from 'node-fetch';

export default async function handler(req, res) {
  const id = parseInt(req.query.id);

  const m3uUrl = "https://raw.githubusercontent.com/atakan1983/kabloo/refs/heads/main/mehmet.m3u";
  const response = await fetch(m3uUrl);
  const content = await response.text();

  const lines = content.split("#EXTINF");
  if (id < 1 || id >= lines.length) {
    res.status(404).send("Kanal bulunamadı");
    return;
  }

  const kanal = "#EXTINF" + lines[id];
  res.setHeader("Content-Type", "application/x-mpegURL");
  res.send(kanal);
}
