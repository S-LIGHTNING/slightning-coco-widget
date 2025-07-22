import { merge } from "../../utils"
import { FunctionType, MutatorType, VoidType } from "../type"
import { BlockBoxOptions, BlockType, BUILD_IN_ICON_URL_MAP, StandardEventTypes, StandardMethodBlockItem, StandardMethodGroup, StandardMethodParamTypes, StandardMethodsItem, StandardMethodTypes, StandardPropertiesItem, StandardPropertyGroup, StandardPropertyTypes, StandardTypes } from "../types"

export function traverseTypes(types: StandardTypes, visitors: TypesVisitors): void {
    if (
        hasVisitor(visitors.PropertyGroup) ||
        hasVisitor(visitors.PropertyTypes)
    ) {
        for (
            const index = { value: 0 };
            index.value <= types.properties.length;
            index.value++
        ) {
            const property: StandardPropertiesItem | undefined = types.properties[index.value]
            if (property == undefined) {
                continue
            }
            if ("contents" in property) {
                new PropertyGroupNode({
                    groupContents: types.properties,
                    index,
                    value: property
                }).traverse(visitors)
                continue
            }
            new PropertyTypesNode({
                groupContents: types.properties,
                index,
                value: property
            }).traverse(visitors)
        }
    }
    if (
        hasVisitor(visitors.MethodGroup) ||
        hasVisitor(visitors.MethodTypes) ||
        hasVisitor(visitors.EventTypes) ||
        hasVisitor(visitors.BlockBoxOptions)
    ) {
        for (
            const index = { value: 0 };
            index.value <= types.methods.length;
            index.value++
        ) {
            const method: StandardMethodsItem | undefined = types.methods[index.value]
            if (method == undefined) {
                continue
            }
            if ("contents" in method) {
                new MethodGroupNode({
                    groupContents: types.methods,
                    index,
                    value: method
                }).traverse(visitors)
                continue
            }
            if ("type" in method) {
                switch (method.type) {
                    case BlockType.METHOD:
                        new MethodTypesNode({
                            groupContents: types.methods,
                            index,
                            value: method as StandardMethodTypes
                        }).traverse(visitors)
                        break
                    case BlockType.EVENT:
                        new EventTypesNode({
                            groupContents: types.methods,
                            index,
                            value: method as StandardEventTypes
                        }).traverse(visitors)
                        break
                }
            } else {
                new BlockBoxOptionsNode({
                    groupContents: types.methods,
                    index,
                    value: method
                }).traverse(visitors)
            }
        }
    }
}

export interface TypesVisitors {
    PropertyGroup?: TypesNodeVisitor<PropertyGroupNode> | null | undefined
    PropertyTypes?: TypesNodeVisitor<PropertyTypesNode> | null | undefined
    MethodGroup?: TypesNodeVisitor<MethodGroupNode> | null | undefined
    MethodTypes?: TypesNodeVisitor<MethodTypesNode> | null | undefined
    EventTypes?: TypesNodeVisitor<EventTypesNode> | null | undefined
    BlockBoxOptions?: TypesNodeVisitor<BlockBoxOptionsNode> | null | undefined
}

export type TypesNodeVisitor<T extends UnknownTypesNode> = (((node: T) => void) | {
    enter?: ((node: T) => void) | null | undefined
    /**
     * @deprecated 该方法是由于早期拼写错误而保留的，请不要使用。
     */
    entry?: ((node: T) => void) | null | undefined
    exit?: ((node: T) => void) | null | undefined
}) & {
    __slightning_coco_widget_visitor_cache__?: TypesVisitorCache<T>
}

interface TypesVisitorCache<T extends UnknownTypesNode> {
    has?: boolean | null | undefined
    hasEnter?: boolean | null | undefined
    hasExit?: boolean | null | undefined
    enter?: ((node: T) => void) | null | undefined
    exit?: ((node: T) => void) | null | undefined
}

export abstract class TypesNode<T, U = T> {

    public readonly group?: TypesNode<(T | U), (T | U)> | null | undefined
    public readonly groupContents: (T | U)[]
    public readonly index: { value: number }
    /**
     * 节点对应的类型定义。
     */
    public readonly value: T
    private __blockOptions?: (T extends {
        blockOptions?: {} | null | undefined
    } ? NonNullable<T["blockOptions"]> : {}) | undefined
    /**
     * 节点的积木选项。与`this.value.blockOptions`不同的是，该项包含从组中继承的积木选项。
     */
    public get blockOptions(): T extends {
        blockOptions?: {} | null | undefined
    } ? NonNullable<T["blockOptions"]> : {} {
        if (this.__blockOptions !== undefined) {
            return this.__blockOptions
        }
        const { value } = this
        return this.__blockOptions = merge(
            {},
            (this.group ?? {}).blockOptions ?? {},
            value != null && typeof value == "object" && "blockOptions" in value ? value.blockOptions ?? {} : {}
        ) as T extends {
            blockOptions?: {} | null | undefined
        } ? NonNullable<T["blockOptions"]> : {}
    }
    public isRemoved: boolean

    public constructor({
        group, groupContents, index, value
    }: {
        group?: TypesNode<(T | U), (T | U)> | null | undefined
        groupContents: (T | U)[]
        index: { value: number }
        value: T
    }) {
        this.group = group
        this.groupContents = groupContents
        this.index = index
        this.value = value
        this.isRemoved = false
    }

    public abstract traverse(this: this, visitors: TypesVisitors): void

    public remove(this: this): void {
        if (this.isRemoved) {
            return
        }
        this.groupContents.splice(this.index.value, 1)
        this.index.value--
        this.isRemoved = true
    }

    public removeNext(this: this): void {
        this.groupContents.splice(this.index.value + 1, 1)
    }

    public replaceWith(this: this, ...values: (T | U)[]): void {
        this.remove()
        this.insertAfter(...values)
    }

    public insertAfter(this: this, ...values: (T | U)[]): void {
        this.groupContents.splice(this.index.value + 1, 0, ...values)
    }
}

export type UnknownTypesNode = TypesNode<unknown, unknown>

export class PropertyGroupNode extends TypesNode<StandardPropertyGroup, StandardPropertiesItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        if (!(
            hasVisitor(visitors.PropertyGroup) ||
            hasVisitor(visitors.PropertyTypes)
        )) {
            return
        }
        enterNode(this, visitors.PropertyGroup)
        for (
            const index = { value: 0 };
            index.value <= this.value.contents.length;
            index.value++
        ) {
            const property: StandardPropertiesItem | undefined = this.value.contents[index.value]
            if (property == undefined) {
                continue
            }
            if ("contents" in property) {
                new PropertyGroupNode({
                    group: this,
                    groupContents: this.value.contents,
                    index,
                    value: property
                }).traverse(visitors)
                continue
            }
            new PropertyTypesNode({
                group: this,
                groupContents: this.value.contents,
                index,
                value: property
            }).traverse(visitors)
        }
        exitNode(this, visitors.PropertyGroup)
    }
}

export class PropertyTypesNode extends TypesNode<StandardPropertyTypes, StandardPropertiesItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        enterNode(this, visitors.PropertyTypes)
        exitNode(this, visitors.PropertyTypes)
    }
}

export class MethodGroupNode extends TypesNode<StandardMethodGroup, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        if (!(
            hasVisitor(visitors.MethodGroup) ||
            hasVisitor(visitors.MethodTypes) ||
            hasVisitor(visitors.EventTypes) ||
            hasVisitor(visitors.BlockBoxOptions)
        )) {
            return
        }
        enterNode(this, visitors.MethodGroup)
        for (
            const index = { value: 0 };
            index.value <= this.value.contents.length;
            index.value++
        ) {
            const method: StandardMethodsItem | undefined = this.value.contents[index.value]
            if (method == undefined) {
                continue
            }
            if ("contents" in method) {
                new MethodGroupNode({
                    group: this,
                    groupContents: this.value.contents,
                    index,
                    value: method
                }).traverse(visitors)
                continue
            }
            if ("type" in method) {
                switch (method.type) {
                    case BlockType.METHOD:
                        new MethodTypesNode({
                            group: this,
                            groupContents: this.value.contents,
                            index,
                            value: method as StandardMethodTypes
                        }).traverse(visitors)
                        break
                    case BlockType.EVENT:
                        new EventTypesNode({
                            group: this,
                            groupContents: this.value.contents,
                            index,
                            value: method as StandardEventTypes
                        }).traverse(visitors)
                        break
                }
            } else {
                new BlockBoxOptionsNode({
                    group: this,
                    groupContents: this.value.contents,
                    index,
                    value: method
                }).traverse(visitors)
            }
        }
        exitNode(this, visitors.MethodGroup)
    }
}

export class MethodTypesNode extends TypesNode<StandardMethodTypes, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        enterNode(this, visitors.MethodTypes)
        exitNode(this, visitors.MethodTypes)
    }
}

export class EventTypesNode extends TypesNode<StandardEventTypes, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        enterNode(this, visitors.EventTypes)
        exitNode(this, visitors.EventTypes)
    }
}

export class BlockBoxOptionsNode extends TypesNode<BlockBoxOptions, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        enterNode(this, visitors.BlockBoxOptions)
        exitNode(this, visitors.BlockBoxOptions)
    }
}

function hasVisitor<T extends UnknownTypesNode>(
    visitor: TypesNodeVisitor<T> | null | undefined
): boolean {
    return getVisitorCache(visitor, "has", (): boolean => (hasEnter(visitor) || hasExit(visitor)))
}

function hasEnter<T extends UnknownTypesNode>(
    visitor: TypesNodeVisitor<T> | null | undefined
): boolean {
    return getVisitorCache(visitor, "hasEnter", (): boolean => (
        visitor != null && (
            typeof visitor == "function" ||
            visitor.enter != null ||
            visitor.entry != null
        )
    ))
}

function hasExit<T extends UnknownTypesNode>(
    visitor: TypesNodeVisitor<T> | null | undefined
): boolean {
    return getVisitorCache(visitor, "hasExit", (): boolean => (
        visitor != null && typeof visitor != "function" && visitor.exit != null
    ))
}

function NULL_TYPES_NODE_VISITOR_FUNCTION(): void {}

function enterNode<T extends UnknownTypesNode>(
    node: T,
    visitor: TypesNodeVisitor<T> | null | undefined
): void {
    getVisitorCache(visitor, "enter", (): (node: T) => void => {
        if (visitor == null) {
            return NULL_TYPES_NODE_VISITOR_FUNCTION
        }
        if (typeof visitor == "function") {
            return visitor
        } else if (visitor.enter != null) {
            return visitor.enter
        } else if (visitor.entry != null) {
            return visitor.entry
        }
        return NULL_TYPES_NODE_VISITOR_FUNCTION
    })(node)
}

function exitNode<T extends UnknownTypesNode>(
    node: T,
    visitor: TypesNodeVisitor<T> | null | undefined
): void {
    getVisitorCache(visitor, "exit", (): (node: T) => void => {
        if (visitor != null && typeof visitor == "object" && visitor.exit != null) {
            return visitor.exit
        }
        return NULL_TYPES_NODE_VISITOR_FUNCTION
    })(node)
}

const NULL_TYPES_NODE_VISITOR_CACHE: TypesVisitorCache<UnknownTypesNode> = {
    has: false,
    hasEnter: false,
    hasExit: false
}

function getVisitorCache<T extends UnknownTypesNode, P extends keyof TypesVisitorCache<T>>(
    visitor: TypesNodeVisitor<T> | null | undefined,
    property: P,
    loader: () => NonNullable<TypesVisitorCache<T>[P]>
): NonNullable<TypesVisitorCache<T>[P]> {
    let visitorCache: TypesVisitorCache<T>
    if (visitor == null) {
        visitorCache = NULL_TYPES_NODE_VISITOR_CACHE
    } else {
        if (visitor.__slightning_coco_widget_visitor_cache__ == null) {
            visitor.__slightning_coco_widget_visitor_cache__ = {}
        }
        visitorCache = visitor.__slightning_coco_widget_visitor_cache__
    }
    const value: TypesVisitorCache<T>[P] = visitorCache[property]
    if (value == null) {
        return visitorCache[property] = loader()
    }
    return value
}

export function methodParamNeedsTransformToEvent(
    part: StandardMethodBlockItem
): part is StandardMethodParamTypes & {
    type: FunctionType<unknown[], unknown>
} {
    if (typeof part != "object") {
        return false
    }
    return part.type instanceof FunctionType && !part.type.raw
}

export function methodParamNeedsTransformToCodeBlocks(
    part: StandardMethodBlockItem
): part is StandardMethodParamTypes & {
    type: FunctionType<unknown[], unknown>
} {
    if (typeof part != "object") {
        return false
    }
    return part.type instanceof FunctionType &&
        !part.type.raw && (
            (part.type.returns != null && !(part.type.returns instanceof VoidType)) ||
            (part.type.throws != null && !(part.type.throws instanceof VoidType))
        )
}

export function methodParamTypeIsMutator(
    part: StandardMethodBlockItem
): part is StandardMethodParamTypes & {
    type: MutatorType
} {
    if (typeof part != "object") {
        return false
    }
    return part.type instanceof MutatorType
}

export function transformIcon(object?: { icon?: string | null | undefined } | null | undefined): void {
    if (object != null && object.icon != null) {
        object.icon = BUILD_IN_ICON_URL_MAP[object.icon] ?? object.icon
    }
}