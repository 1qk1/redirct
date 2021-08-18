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
      {/* <header className="hero">
        <h1 className="title">Weeklify</h1>
      </header> */}
      <main>
        {children}
      </main>
      {/* <style jsx>{`
        .hero {
          text-align: center;
        }
        .title {
          margin-bottom: 4rem;
        }
      `}</style> */}
    </>
  )
}

export default Layout
