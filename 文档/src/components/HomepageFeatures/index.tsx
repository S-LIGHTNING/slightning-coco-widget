import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '函数一等公民',
    description: (
      <>
        像使用其他类型的数据一样使用函数，函数可以作为参数传递给其他函数，也可以作为其他函数的返回值。SCW 可以将这些函数转为编辑器支持的形式。
      </>
    ),
  },
  {
    title: '方法调用验证',
    description: (
      <>
        SCW 可以检查方法调用是否正确，如果方法不存在或参数类型不匹配，SCW 会报错提示。此外，SCW 还可以捕获方法调用中的异常，并显示异常信息。
      </>
    ),
  },
  {
    title: 'Creation Project 支持',
    description: (
      <>
        支持部分 Creation Project 特性，如：控件分类、方法回调。让你的控件在 Creation Project 中更强大。
      </>
    ),
  },
  {
    title: '方法分组',
    description: (
      <>
        为一组方法统一设置积木样式；无需手动调整积木标签和积木间距，SCW 可以根据方法分组自动调整。
      </>
    ),
  },
  {
    title: '自动绕过限制',
    description: (
      <>
        自动绕过 CoCo 对自定义控件的限制，如：控件关键词检查；全局对象访问限制。
      </>
    ),
  },
  {
    title: 'TypeScript 支持',
    description: (
      <>
        支持 TypeScript。TypeScript 强大的类型系统可以帮助你更好地开发控件。
      </>
    ),
  },
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
