import Head from 'next/head'
import Layout from "../components/Layout"
import axios from "axios";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import RedirectIcon from '../images/svg/redirects.svg'
import ProxyIcon from '../images/svg/proxy.svg'

const Home = ({ routes }) => {
  return (
    <Layout>
      <Head>
        <title>Dashboard | Redirct</title>
        <meta property="og:title" content="Redirects made easy" key="title" />
      </Head>
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-6 col-md-3"><a href='/proxy' className="dashboard-box link-trans"><ProxyIcon className="dashboard-box-icon dashboard-box-icon-proxy" /> {routes.proxy.length} Proxy hosts</a></div>
          <div className="col-12 col-sm-6 col-md-3"><a href='/redirects' className="dashboard-box link-trans"><RedirectIcon className="dashboard-box-icon dashboard-box-icon-redirect" /> {routes.redirects.length} Redirects</a></div>
        </div>
      </div>
    </Layout>
  )
}

export default Home


export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const response = await axios.get(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/`);
    const routes = response.data.reduce((routes, route) => {
      const newRoutes = { ...routes };
      if (route.settings.mode === 'redirect') {
        newRoutes.redirects.push(route);
      } else {
        newRoutes.proxy.push(route);
      }
      return newRoutes
    }, { redirects: [], proxy: [] })
    return {
      props: { routes }
    }
  }
})