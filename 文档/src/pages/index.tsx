import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl'

import styles from './index.module.css';
import Appreciation from '@site/src/components/Appreciation'
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title.replace(/文档/g, "")}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction/overview/">
            查看介绍
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/tutorial/fast-start">
            阅读教程
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
        <div className="text--center">
          <Heading as="h2">评价</Heading>
          <ThemedImage sources={{
            light: useBaseUrl("/img/homepage/comments/light.png"),
            dark: useBaseUrl("/img/homepage/comments/dark.png")
          }}></ThemedImage>
        </div>
        <div className="text--center">
          <Heading as="h2">星星</Heading>
          <a href="https://www.star-history.com/#S-LIGHTNING/slightning-coco-widget&Date">
            <ThemedImage
              sources={{
                light: "https://api.star-history.com/svg?repos=S-LIGHTNING/slightning-coco-widget&type=Date",
                dark: "https://api.star-history.com/svg?repos=S-LIGHTNING/slightning-coco-widget&type=Date&theme=dark"
              }}
              alt="Star History Chart"
            ></ThemedImage>
          </a>
        </div>
        <Appreciation />
      </main>
    </Layout>
  );
}
