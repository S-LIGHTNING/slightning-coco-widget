import { StandardMethodBlockItem, StandardMethodTypes, StandardTypes } from "../types"
import { Widget } from "../widget"
import { methodParamTypeIsMutator, MethodTypesNode, traverseTypes } from "./utils"

export function addTransformMutator(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (!node.value.block.some(methodParamTypeIsMutator)) {
                return
            }
            const { value: method } = node
            let methodParamsCount: number = 0
            for (let i: number = 0; i < method.block.length; i++) {
                const item: StandardMethodBlockItem | undefined = method.block[i]
                if (item == undefined) {
                    continue
                }
                if (!methodParamTypeIsMutator(item)) {
                    if (typeof item == "object") {
                        methodParamsCount++
                    }
                    continue
                }
                let mutatorParamsCount: number = 0
                for (const mutator of item.type.block) {
                    if (typeof mutator == "object") {
                        mutatorParamsCount++
                    }
                }
                const { transformMin, transformMax } = item.type
                for (let j: number = transformMax; j >= transformMin; j--) {
                    const key: string = `__slightning_coco_widget_transform_mutator_${item.key}_${j}__${method.key}`
                    const transformedMethod: StandardMethodTypes = {
                        ...method,
                        key,
                        block: [...method.block]
                    }
                    const transformedBlockItems: StandardMethodBlockItem[] = []
                    for (let k: number = 0; k < j; k++) {
                        transformedBlockItems.push(...item.type.block.map(
                            (mutatorItem: StandardMethodBlockItem): StandardMethodBlockItem => {
                                if (typeof mutatorItem == "string") {
                                    return mutatorItem
                                }
                                return {
                                    ...mutatorItem,
                                    key: `__slightning_coco_widget_mutator_param_${item.key}_${k}_item__${mutatorItem.key}`
                                }
                            }
                        ))
                    }
                    transformedMethod.block.splice(i, 1, ...transformedBlockItems)
                    node.insertAfter({ space: 8 }, transformedMethod)
                    Object.defineProperty(widget.prototype, key, {
                        value: function (...args: unknown[]): unknown {
                            const mutatorArgs: unknown[] = args.splice(methodParamsCount, j * mutatorParamsCount)
                            const transformedMutatorArgs: Record<string, unknown>[] = []
                            while (mutatorArgs.length > 0) {
                                const transformedMutatorArg: Record<string, unknown> = {}
                                for (const mutator of item.type.block) {
                                    if (typeof mutator == "object") {
                                        transformedMutatorArg[mutator.key] = mutatorArgs.shift()
                                    }
                                }
                                transformedMutatorArgs.push(transformedMutatorArg)
                            }
                            args.splice(methodParamsCount, 0, transformedMutatorArgs)
                            return this[method.key](...args)
                        },
                        writable: true,
                        enumerable: false,
                        configurable: true
                    })
                }
                break
            }
        }
    })
    return [types, widget]
}
