import type * as webpack from "webpack"

export default function NullLoader(
    this: webpack.LoaderContext<void>,
    content: string,
    sourceMap: any,
    additionalData?: any
): void {
    this.callback(null, content, sourceMap, additionalData)
}
