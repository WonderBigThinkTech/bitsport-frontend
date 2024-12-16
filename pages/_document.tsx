import { Html, Main, Head, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>
          BitPool - Play and Earn Crypto with BitPool: The World&apos;s First
          AI-Powered Web-3 Based 8-Ball Pool Game by BitSport
        </title>
        <meta
          property="og:title"
          content="Play and Earn Crypto with BitPool: The World's First AI-Powered Web-3 Based 8-Ball Pool Game by BitSport"
        />
        <meta
          name="twitter:image"
          content="https://play.bitpool.gg/xthumb-farm.png"
        />
        <meta property="og:type" content="game" />
        <meta property="og:url" content="https://bitpool.gg/" />
        <meta property="og:image" content="https://bitpool.gg/img/logo.svg" />
        <meta
          property="og:description"
          content="BitPool is the world's first AI-powered, web3-based 8-ball pool game. Play, earn and compete against AI and other players, earn $BITP and other Crypto"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
