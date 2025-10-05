import { getNewMethodKey, runtimeAddTransformMutator, RuntimeData } from "../runtime/decorators/add-transform-mutator"
import { StandardMethodBlockItem, StandardMethodTypes, StandardTypes } from "../types"
import { Widget } from "../widget"
import { methodParamTypeIsMutator, MethodTypesNode, recordDecoratorOperation, traverseTypes } from "./utils"

export function addTransformMutator(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    const runtimeData: RuntimeData = {
        methods: []
    }
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (!node.value.block.some(methodParamTypeIsMutator)) {
                return
            }
            const { value: method } = node
            let methodParamsCount: number = 0
            for (let paramIndex: number = 0; paramIndex < method.block.length; paramIndex++) {
                const param: StandardMethodBlockItem | undefined = method.block[paramIndex]
                if (param == undefined) {
                    continue
                }
                if (!methodParamTypeIsMutator(param)) {
                    if (typeof param == "object") {
                        methodParamsCount++
                    }
                    continue
                }
                let mutatorParamsCount: number = 0
                for (const mutator of param.type.block) {
                    if (typeof mutator == "object") {
                        mutatorParamsCount++
                    }
                }
                const { transformMin, transformMax } = param.type
                for (let totalCount: number = transformMax; totalCount >= transformMin; totalCount--) {
                    const key: string = getNewMethodKey(method.key, param.key, totalCount)
                    const transformedMethod: StandardMethodTypes = {
                        ...method,
                        key,
                        block: [...method.block]
                    }
                    const transformedBlockItems: StandardMethodBlockItem[] = []
                    let isFirst: boolean = true
                    for (let count: number = 0; count < totalCount; count++) {
                        if (isFirst) {
                            isFirst = false
                        } else {
                            transformedBlockItems.push(...param.type.separators)
                        }
                        transformedBlockItems.push(...param.type.block.map(
                            (mutatorItem: StandardMethodBlockItem): StandardMethodBlockItem => {
                                if (typeof mutatorItem == "string") {
                                    return mutatorItem
                                }
                                return {
                                    ...mutatorItem,
                                    key: getMutatorItemKey(param.key, mutatorItem.key, count)
                                }
                            }
                        ))
                    }
                    transformedMethod.block.splice(paramIndex, 1, ...transformedBlockItems)
                    node.insertAfter({ space: 8 }, transformedMethod)
                }
                runtimeData.methods.push({
                    key: method.key,
                    mutator: {
                        key: param.key,
                        keys: param.type.block.filter(item => typeof item == "object").map(item => item.key),
                        index: methodParamsCount,
                        min: transformMin,
                        max: transformMax
                    }
                })
                break
            }
        }
    })
    recordDecoratorOperation(widget, {
        runtime: {
            func: "runtimeAddTransformMutator",
            data: runtimeData
        }
    })
    runtimeAddTransformMutator(runtimeData, widget)
    return [types, widget]
}

export function getMutatorItemKey(paramKey: string, itemKey: string, count: number): string {
    return `__slightning_coco_widget_mutator_param_${paramKey}_${count}_item__${itemKey}`
}
