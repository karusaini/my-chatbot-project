import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>TalkBot AI: Intelligent Chatbot Assistant</title>
        <meta
          name="description"
          content="TalkBot AI provides smart, real-time conversations powered by advanced AI, delivering seamless user interactions and dynamic responses."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
