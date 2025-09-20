import { defineMethod } from "../../../utils"
import { Widget } from "../../widget"

export interface RuntimeData {
    methods: {
        key: string
        mutator: {
            key: string
            keys: string[]
            index: number
            min: number
            max: number
        }
    }[]
}

export function runtimeAddTransformMutator(data: RuntimeData, widget: Widget): Widget {
    for (const { key, mutator: { key: mutatorKey, keys, index, min, max } } of data.methods) {
        for (let totalCount = min; totalCount <= max; totalCount++) {
            defineMethod(widget.prototype, getNewMethodKey(key, mutatorKey, totalCount), function (this: any, ...args) {
                const mutatorArgs: unknown[] = args.splice(index, totalCount * keys.length)
                const transformedMutatorArgs: Record<string, unknown>[] = []
                while (mutatorArgs.length > 0) {
                    const transformedMutatorArg: Record<string, unknown> = {}
                    for (const key of keys) {
                        transformedMutatorArg[key] = mutatorArgs.shift()
                    }
                    transformedMutatorArgs.push(transformedMutatorArg)
                }
                args.splice(keys.length, 0, transformedMutatorArgs)
                return this[key](...args)
            })
        }
    }
    return widget
}

export function getNewMethodKey(methodKey: string, paramKey: string, count: number): string {
    return `__slightning_coco_widget_transform_mutator_${paramKey}_${count}__${methodKey}`
}
