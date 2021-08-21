import { UserProvider } from '@auth0/nextjs-auth0';

import "bootstrap/scss/bootstrap.scss"
import "../css/global.scss"

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

