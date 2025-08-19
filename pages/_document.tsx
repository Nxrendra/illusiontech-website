import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import type { DocumentProps, DocumentContext } from 'next/document'

type Props = DocumentProps & {
  nonce?: string
}

class MyDocument extends React.Component<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await ctx.defaultGetInitialProps(ctx)
    const nonce = ctx.req?.headers['x-nonce'] as string | undefined
    return { ...initialProps, nonce }
  }

  render() {
    const { nonce } = this.props
    return (
      <Html>
        <Head nonce={nonce} />
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    )
  }
}

export default MyDocument