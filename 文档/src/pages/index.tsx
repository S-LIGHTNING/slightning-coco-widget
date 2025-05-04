import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import Appreciation from '../components/Appreciation'

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction/dissuade/">
            劝退指南
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction/overview/">
            查看介绍
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/fast-start/before-start">
            快速开始
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.title}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <Appreciation />
      </main>
    </Layout>
  );
}
