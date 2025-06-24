const kanalListesi = {'tele1': 'fNqmmqNNGp8', 'halk_tv': 'fNqmmqNNGp8', 'krt': 'fNqmmqNNGp8', 'showmax': 'fNqmmqNNGp8', 'trt1': 'fNqmmqNNGp8', 'htspor': 'fNqmmqNNGp8', 'aspor': 'fNqmmqNNGp8', 'tvnet': 'fNqmmqNNGp8', 'tv100': 'fNqmmqNNGp8', 'trthaber': 'fNqmmqNNGp8', 'sozcu': 'fNqmmqNNGp8', 'ekol': 'fNqmmqNNGp8', 'tgrt': 'fNqmmqNNGp8', 'ahaber': 'fNqmmqNNGp8', 'beinhaber': 'fNqmmqNNGp8', 'uluisal': 'fNqmmqNNGp8', 'gulsahfilm': 'fNqmmqNNGp8', 'haberglobal': 'fNqmmqNNGp8', 'tv24': 'fNqmmqNNGp8', 'ntv': 'fNqmmqNNGp8', 'kralpop': 'fNqmmqNNGp8', 'haberturk': 'fNqmmqNNGp8', 'bloomberg': 'fNqmmqNNGp8', 'yesilcam': 'fNqmmqNNGp8', 'kemalsfilm1': 'fNqmmqNNGp8', 'kemalsfilm2': 'fNqmmqNNGp8', 'kemalsfilm3': 'fNqmmqNNGp8', 'enstremental': 'fNqmmqNNGp8', 'wildlife': 'fNqmmqNNGp8', 'eljezire': 'fNqmmqNNGp8', 'france_24': 'fNqmmqNNGp8', 'natgeo': 'fNqmmqNNGp8', 'natgeo2': 'fNqmmqNNGp8', 'cnbcnews': 'fNqmmqNNGp8', 'sportstonight': 'fNqmmqNNGp8'};

export default async function handler(req, res) {
  const { name } = req.query;

  if (!name || !kanalListesi[name]) {
    return res.status(400).send("Geçersiz kanal adı.");
  }

  const id = kanalListesi[name];

  try {
    const ytdlp = await fetch(`https://pipedapi.kavin.rocks/streams/${id}`);
    const data = await ytdlp.json();
    const m3u8 = data.videoStreams?.find(stream => stream.url.includes(".m3u8"))?.url;

    if (!m3u8) return res.status(404).send("Yayın bulunamadı.");

    res.writeHead(302, { Location: m3u8 });
    res.end();
  } catch (e) {
    res.status(500).send("Hata: " + e.message);
  }
}
