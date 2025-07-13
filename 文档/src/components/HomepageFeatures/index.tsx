import Heading from '@theme/Heading';
import styles from './styles.module.css';
import BypassRestrictionsPlay from '@site/src/components/BypassRestrictionsPlay';;
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import { useEffect } from 'react';
import ExampleCode from '@site/src/components/ExampleCode';
import Fullwindowable from '../Fullwindowable'

type FeatureItem = {
  id?: string;
  title: string;
  description: string;
  children?: JSX.Element | JSX.Element[];
};

function Feature({ id, title, description, children }: FeatureItem): JSX.Element {
  return (
    <div id={id} className="padding-horiz--md">
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
      <div>{children}</div>
    </div>
  );
}

if (typeof window != "undefined") {
  window.MonacoEnvironment = {
    getWorkerUrl(__moduleId: string, label: string): string {
      if (label == "typescript" || label == "javascript") {
        return "./ts.worker.js"
      }
      return "./editor.worker.js"
    }
  }
}

export default function HomepageFeatures(): JSX.Element {
  const { colorMode } = useColorMode()
  useEffect((): void => {
    import("monaco-editor").then((monaco: typeof import("monaco-editor")): void => {
      monaco.editor.setTheme(colorMode == "light" ? "vs" : "vs-dark")
    })
  }, [colorMode])
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className="text--center">特性</Heading>
        <Feature
          id="feature--functions-as-first-class-citizens"
          title="模拟函数一等公民"
          description="像使用其他类型的数据一样使用函数，函数可以作为参数传递给其他函数，也可以作为其他函数的返回值。SCW 可以将这些函数转为编辑器支持的形式。"
        >
          <div className={styles.featureChildren}>
            <Fullwindowable className={styles.codeArea}>
              <ExampleCode src="/code/homepage/features/functions-as-first-class-citizens/example.ts" />
            </Fullwindowable>
            <Fullwindowable className={styles.blockImageArea}>
              <p>在 CoCo 中使用控件：</p>
              <img
                className={styles.blockImage}
                src={useBaseUrl("/img/homepage/features/functions-as-first-class-citizens/block-coco.png")}
              />
              <p>在 Creation Project 中使用控件：</p>
              <img
                className={styles.blockImage}
                src={useBaseUrl("/img/homepage/features/functions-as-first-class-citizens/block-creation-project.png")}
              />
            </Fullwindowable>
          </div>
        </Feature>
        <Feature
          id="feature--call-method-check"
          title="方法调用验证"
          description="SCW 可以检查方法调用是否正确，如果方法不存在或参数类型不匹配，SCW 会报错提示。此外，SCW 还可以捕获方法调用中的异常，并显示异常信息。"
        >
          <div className={styles.featureChildren}>
            <Fullwindowable className={styles.codeArea}>
              <ExampleCode src="/code/homepage/features/call-method-check/example.ts" />
            </Fullwindowable>
            <Fullwindowable className={styles.blockImageArea}>
              <p>调用方法：</p>
              <img
                className={styles.blockImage}
                src={useBaseUrl("/img/homepage/features/call-method-check/call-method.png")}
              />
              <p>编辑器控制台报错：</p>
              <img
                className={styles.blockImage}
                src={useBaseUrl("/img/homepage/features/call-method-check/editor-error.png")}
              />
              <p>浏览器控制台报错：</p>
              <img
                className={styles.blockImage}
                src={useBaseUrl("/img/homepage/features/call-method-check/browser-error.png")}
              />
            </Fullwindowable>
          </div>
        </Feature>
        <Feature
          title="Creation Project 支持"
          description="支持部分 Creation Project 特性，如：控件分类、方法回调。让你的控件在 Creation Project 中更强大。"
        ></Feature>
        <Feature
          id="feature--method-group"
          title="方法分组"
          description="为一组方法统一设置积木样式；无需手动调整积木标签和积木间距，SCW 可以根据方法分组自动调整。"
        >
          <div className={styles.featureChildren}>
            <Fullwindowable className={styles.codeArea}>
              <ExampleCode src="/code/homepage/features/method-group/example.ts" />
            </Fullwindowable>
            <Fullwindowable className={styles.blockImageArea}>
              <p>生成的积木：</p>
              <img
                className={styles.blockImage}
                src={useBaseUrl("/img/homepage/features/method-group/block-box.png")}
              />
            </Fullwindowable>
          </div>
        </Feature>
        <Feature
          id="feature--auto-bypass-restrictions"
          title="自动绕过限制"
          description="自动绕过 CoCo 对自定义控件的限制，如：控件关键词检查；全局对象访问限制。"
        >
          <p>下面展示了部分绕过这些限制的方式，你可以修改其中的示例代码。</p>
          <Fullwindowable className={styles.bypassRestrictionsPlay}>
            <BypassRestrictionsPlay />
          </Fullwindowable>
        </Feature>
        <Feature
          title="TypeScript 支持"
          description="支持 TypeScript。TypeScript 强大的类型系统可以帮助你更好地开发控件。"
        ></Feature>
      </div>
    </section>
  );
}
