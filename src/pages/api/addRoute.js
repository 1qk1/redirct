import axios from "axios";
import splitURL from '../../utils/splitURL'

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { from, to, mode = null } = req.body
    if (!mode && mode !== "proxy" && mode !== 'redirect') return res.status(400);
    const splittedFrom = splitURL(from)
    if (!splittedFrom) {
      return res.status(400).json({ errors: { from: "Bad source" } })
    }
    const splittedTo = splitURL(to)

    if (!splittedTo) {
      return res.status(400).json({ errors: { to: "Bad target" } })
    }
    let protocolTo = ""
    if (!splittedTo.protocol) {
      protocolTo = 'http://'
    }
    const response = await axios.post(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/`, { "source": splittedFrom.domain, "target": `${protocolTo}${to}`, "settings": { "mode": mode } });
    return res.status(200).json(response.data)
  }
  return null
}


export default withApiAuthRequired(handler);