import axios from "axios";
import splitURL from '../../utils/splitURL'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { from, to, enforceHTTPS = false } = req.body
    const splittedFrom = splitURL(from)
    if (!splittedFrom) {
      return res.status(400).json({ error: "Bad source" })
    }
    const splittedTo = splitURL(to)

    if (!splittedTo) {
      return res.status(400).json({ error: "Bad target" })
    }
    let protocolTo = "http://"
    if (enforceHTTPS || splittedTo.protocol) {
      protocolTo = (splittedTo.protocol) ? '' : 'https://'
    }
    const response = await axios.post(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/`, { "source": splittedFrom.domain, "target": `${protocolTo}${to}`, "settings": { "mode": "redirect", "enforce_https": enforceHTTPS } });
    return res.status(200).json(response.data)
  }
  return null
}
