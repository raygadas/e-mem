import * as React from 'react'
import Head from 'next/head'

type Props = {
    title?: string
}

const Layout: React.FunctionComponent<Props> = ({children, title = 'e-mem',}) => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        </Head>
        <div className="bg-gray-200 min-h-screen">
            <header>
            </header>
            {children}
        </div>
    </div>
);

export default Layout
