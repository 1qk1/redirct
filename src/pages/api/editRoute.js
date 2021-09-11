import axios from "axios";
import splitURL from '../../utils/splitURL'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

async function handler(req, res) {
  if (req.method === 'PUT') {
    const { from, to, mode = null } = req.body
    if (!mode && mode !== "proxy" && mode !== 'redirect') return res.status(400);
    const splittedTo = splitURL(to)
    if (!splittedTo) {
      return res.status(400).json({ errors: { to: "Bad target" } })
    }
    let protocolTo = ""
    if (!splittedTo.protocol) {
      protocolTo = 'http://'
    }
    const response = await axios.put(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/${encodeURIComponent(from)}`, { "source": from, "target": `${to}`, "settings": { "mode": mode } });
    return res.status(200).json(response.data)
  }
  return null
}
export default withApiAuthRequired(handler);