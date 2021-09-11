import React from "react"
import Head from "next/head"

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main>
        {children}
      </main>
    </>
  )
}

export default Layout
