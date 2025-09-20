import { MethodBlockParam, StandardTypes } from "../types"
import { Widget } from "../widget"
import { MethodTypesNode, recordDecoratorOperation, traverseTypes } from "./utils"
import { runtimeAddCheck, RuntimeData, RuntimeParamData } from "../runtime/decorators/add-check"

export function addCheck(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    const runtimeData: RuntimeData = {
        widgetTitle: types.info.title,
        isVisibleWidget: types.options.visible,
        methodsMap: {}
    }
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            const { value: method } = node
            const texts: string[] = []
            const params: RuntimeParamData[] = []
            let label: string | null = null
            function addText(text: string) {
                if (label == null) {
                    label = text
                } else if (label.endsWith("\n") || text.startsWith("\n")) {
                    label += text
                } else {
                    label += " " + text
                }
            }
            for (const item of method.block) {
                if (item == MethodBlockParam.THIS) {
                    continue
                } else if (item == MethodBlockParam.METHOD) {
                    addText(method.label)
                } else if (item == MethodBlockParam.BREAK_LINE) {
                    addText("\n")
                } else if (typeof item == "string") {
                    addText(item)
                } else {
                    texts.push(label ?? "")
                    label = null
                    params.push({
                        label: item.label,
                        type: item.type
                    })
                }
            }
            texts.push(label ?? "")
            runtimeData.methodsMap[method.key] = {
                label: method.label,
                texts,
                params,
                deprecated: method.deprecated ?? node.blockOptions.deprecated ?? undefined
            }
        }
    })
    recordDecoratorOperation(widget, {
        runtime: {
            func: "runtimeAddCheck",
            data: runtimeData
        }
    })
    return [types, runtimeAddCheck(runtimeData, widget)]
}
