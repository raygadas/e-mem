import { NextPage } from 'next'
import Link from 'next/link'
import Layout from '../components/Layout'
import List from '../components/List'


const WithInitialProps: NextPage<Props> = ({ query }) => (
  <Layout title="List Example (as Functional Component) | Next.js + TypeScript Example">
    <h1>List Example (as Function Component)</h1>
    <p>You are currently on: {pathname}</p>
    <List items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

WithInitialProps.getInitialProps = async ({ query }) {
    return { query }
  }

export default WithInitialProps
