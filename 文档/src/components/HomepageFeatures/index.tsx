import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '复杂',
    description: (
      <>
        繁琐的配置，奇葩的特性，根本学不会怎么用。
      </>
    ),
  },
  {
    title: '臃肿',
    description: (
      <>
        打包空控件就有 100kb 多，随便用几个功能都能到 200kb。
      </>
    ),
  },
  {
    title: '无用',
    description: (
      <>
        开发个 CoCo 控件而已，有必要上工程化吗？
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
