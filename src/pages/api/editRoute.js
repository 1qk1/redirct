import axios from "axios";
import splitURL from '../../utils/splitURL'

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { from, to, enforceHTTPS = false } = req.body
    const splittedTo = splitURL(to)
    if (!splittedTo) {
      return res.status(400).json({ error: "Bad target" })
    }
    let protocolTo = "http://"
    if (enforceHTTPS || splittedTo.protocol) {
      protocolTo = (splittedTo.protocol) ? '' : 'https://'
    }
    const response = await axios.put(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/${encodeURIComponent(from)}`, { "source": from, "target": `${to}`, "settings": { "mode": "redirect", "enforce_https": enforceHTTPS } });
    return res.status(200).json(response.data)
  }
  return null
}
