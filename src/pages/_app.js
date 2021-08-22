import { UserProvider } from '@auth0/nextjs-auth0';
import Nav from '../components/nav'
import "bootstrap/scss/bootstrap.scss"
import "../css/global.scss"

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  )
}

