import axios from "axios";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { domains } = req.body
    const promises = domains.map(domain => {
      return axios.delete(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/${encodeURIComponent(domain)}`, {
        headers: {
          domain: domain
        }
      });
    })
    Promise.all(promises).then(values => {
      return res.status(200).json({ deleted: values.map(v => v.config.headers.domain) })
    })
  }
  return null
}

export default withApiAuthRequired(handler);