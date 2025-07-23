import { capitalize } from "../../utils"
import { FunctionType, Type } from "../type"
import { BlockType, Color, MethodBlockItem, MethodBlockOptions, StandardMethodsItem, StandardTypes } from "../types"
import { Widget } from "../widget"
import { EventTypesNode, MethodTypesNode, traverseTypes } from "./utils"

export function generateMethodForFunctions(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (node.value.throws != null) {
                node.insertAfter(...generateMethodsForEfferent(
                    [node.value.key, "__slightning_coco_widget_function_throw_value__"],
                    [node.value.label, "抛出值"],
                    node.value.throws,
                    node.value.blockOptions,
                    widget
                ))
            }
            if (node.value.returns != null) {
                node.insertAfter(...generateMethodsForEfferent(
                    [node.value.key, "__slightning_coco_widget_function_return_value__"],
                    [node.value.label, "返回值"],
                    node.value.returns,
                    node.value.blockOptions,
                    widget
                ))
            }
            for (let j: number = node.value.block.length - 1; j >= 0; j--) {
                const part: MethodBlockItem | undefined = node.value.block[j]
                if (typeof part != "object") {
                    continue
                }
                node.insertAfter(...generateMethodsForAfferent(
                    [node.value.key, "__slightning_coco_widget_function_param__", part.key],
                    [node.value.label, "参数", part.label],
                    part.type,
                    node.value.blockOptions,
                    widget
                ))
            }
        },
        EventTypes(node: EventTypesNode): void {
            for (const param of node.value.params) {
                if (param.type instanceof FunctionType) {
                    node.insertAfter(...generateMethodsForEfferent(
                        [node.value.key, "__slightning_coco_widget_event_param__", capitalize(param.key)],
                        [node.value.label, "参数", param.label],
                        param.type,
                        {
                            color: Color.BLUE,
                            ...node.value.blockOptions
                        },
                        widget
                    ))
                }
            }
        }
    })
    return [types, widget]
}

function generateMethodsForEfferent(
    keys: string[],
    labels: string[],
    type: Type,
    blockOptions: MethodBlockOptions | null | undefined,
    widget: Widget
): StandardMethodsItem[] {
    const result: StandardMethodsItem[] = []
    if (type instanceof FunctionType && !type.raw) {
        result.push(...generateMethodForFunction(keys, labels, type, blockOptions, widget))
    }
    for (const child of type.getSameDirectionChildren()) {
        result.push(...generateMethodsForEfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    for (const child of type.getReverseDirectionChildren()) {
        result.push(...generateMethodsForAfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    return result
}

function generateMethodsForAfferent(
    keys: string[],
    labels: string[],
    type: Type,
    blockOptions: MethodBlockOptions | null | undefined,
    widget: Widget
): StandardMethodsItem[] {
    const result: StandardMethodsItem[] = []
    for (const child of type.getSameDirectionChildren()) {
        result.push(...generateMethodsForAfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    for (const child of type.getReverseDirectionChildren()) {
        result.push(...generateMethodsForEfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    return result
}

function generateMethodForFunction(
    keys: string[],
    labels: string[],
    type: FunctionType<unknown[], unknown>,
    blockOptions: MethodBlockOptions | null | undefined,
    widget: Widget
): StandardMethodsItem[] {
    const key: string = `__slightning_coco_widget_call_function__${keys.join("")}`
    const label: string = labels.join("·")
    Object.defineProperty(widget.prototype, key, {
        value: function (func: (...args: unknown[]) => unknown, ...args: unknown[]): unknown {
            return func.apply(this, args)
        },
        writable: true,
        enumerable: false,
        configurable: true
    })
    return [
        {
            space: 8
        }, {
            type: BlockType.METHOD,
            key,
            label,
            block: [
                {
                    key: "__slightning_coco_widget_function__",
                    label,
                    type: new FunctionType({
                        block: type.block,
                        returns: type.returns,
                        throws: type.throws,
                        defaultValue: label,
                        raw: true
                    })
                }, ...type.block
            ],
            returns: type.returns,
            throws: type.throws,
            blockOptions
        }
    ]
}
