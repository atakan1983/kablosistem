import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { id } = req.query;

  const m3uUrl = 'https://raw.githubusercontent.com/atakan1983/kabloo/refs/heads/main/mehmet.m3u';

  try {
    const response = await fetch(m3uUrl);
    const text = await response.text();

    const parts = text.split('#EXTINF').filter(p => p.trim() !== '');
    const index = parseInt(id);

    if (isNaN(index) || index < 1 || index > parts.length) {
      return res.status(404).send('Kanal bulunamadı.');
    }

    const selected = parts[index - 1];
    const final = `#EXTM3U\n#EXTINF${selected.trim()}`;

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.status(200).send(final);
  } catch (err) {
    res.status(500).send('Bir hata oluştu.');
  }
}
