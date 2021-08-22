import axios from "axios";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';


async function handler(req, res) {
  if (req.method === 'GET') {
    const response = await axios.get(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/`)
    return res.status(200).json(response.data.filter(route => route.settings.mode === 'redirect'))
  }
}

export default withApiAuthRequired(handler);