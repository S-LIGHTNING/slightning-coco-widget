import { merge } from "../../utils"
import { FunctionType, VoidType } from "../type"
import { BlockBoxOptions, BlockType, BUILD_IN_ICON_URL_MAP, StandardEventTypes, StandardMethodBlockItem, StandardMethodGroup, StandardMethodParamTypes, StandardMethodsItem, StandardMethodTypes, StandardPropertiesItem, StandardPropertyGroup, StandardPropertyTypes, StandardTypes } from "../types"

export function traverseTypes(types: StandardTypes, visitors: TypesVisitors): void {
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
                blockOptions: property.blockOptions ?? {},
                value: property
            }).traverse(visitors)
            continue
        }
        new PropertyTypesNode({
            groupContents: types.properties,
            index,
            blockOptions: property.blockOptions ?? {},
            value: property
        }).traverse(visitors)
    }
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
                blockOptions: method.blockOptions ?? {},
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
                        blockOptions: method.blockOptions ?? {},
                        value: method as StandardMethodTypes
                    }).traverse(visitors)
                    break
                case BlockType.EVENT:
                    new EventTypesNode({
                        groupContents: types.methods,
                        index,
                        blockOptions: method.blockOptions ?? {},
                        value: method as StandardEventTypes
                    }).traverse(visitors)
                    break
            }
        } else {
            new BlockBoxOptionsNode({
                groupContents: types.methods,
                index,
                blockOptions: null,
                value: method
            }).traverse(visitors)
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

export type TypesNodeVisitor<T extends TypesNode<unknown, unknown>> = ((node: T) => void) | {
    entry?: ((node: T) => void) | null | undefined
    exit?: ((node: T) => void) | null | undefined
}

export abstract class TypesNode<T, U = T> {

    public readonly groupContents: (T | U)[]
    public readonly index: { value: number }
    public readonly value: T
    public readonly blockOptions: T extends {
        blockOptions?: unknown | null | undefined
    } ? NonNullable<T["blockOptions"]> : unknown
    public isRemoved: boolean

    public constructor({
        groupContents, index, blockOptions, value
    }: {
        groupContents: (T | U)[]
        index: { value: number }
        blockOptions: T extends {
            blockOptions?: unknown | null | undefined
        } ? NonNullable<T["blockOptions"]> : null,
        value: T
    }) {
        this.groupContents = groupContents
        this.index = index
        this.blockOptions = blockOptions
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

    public replaceWith(this: this, ...values: (T | U)[]): void {
        this.remove()
        this.insertAfter(...values)
    }

    public insertAfter(this: this, ...values: (T | U)[]): void {
        this.groupContents.splice(this.index.value + 1, 0, ...values)
    }
}

export class PropertyGroupNode extends TypesNode<StandardPropertyGroup, StandardPropertiesItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        entry(this, visitors.PropertyGroup)
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
                    groupContents: this.value.contents,
                    index,
                    blockOptions: {
                        ...this.blockOptions,
                        ...this.value.blockOptions
                    },
                    value: property
                }).traverse(visitors)
                continue
            }
            new PropertyTypesNode({
                groupContents: this.value.contents,
                index,
                blockOptions: merge({}, this.blockOptions, this.value.blockOptions ?? {}),
                value: property
            }).traverse(visitors)
        }
        exit(this, visitors.PropertyGroup)
    }
}

export class PropertyTypesNode extends TypesNode<StandardPropertyTypes, StandardPropertiesItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        entry(this, visitors.PropertyTypes)
        exit(this, visitors.PropertyTypes)
    }
}

export class MethodGroupNode extends TypesNode<StandardMethodGroup, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        entry(this, visitors.MethodGroup)
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
                    groupContents: this.value.contents,
                    index,
                    blockOptions: {
                        ...this.blockOptions,
                        ...this.value.blockOptions
                    },
                    value: method
                }).traverse(visitors)
                continue
            }
            if ("type" in method) {
                switch (method.type) {
                    case BlockType.METHOD:
                        new MethodTypesNode({
                            groupContents: this.value.contents,
                            index,
                            blockOptions: {
                                ...this.blockOptions,
                                ...this.value.blockOptions
                            },
                            value: method as StandardMethodTypes
                        }).traverse(visitors)
                        break
                    case BlockType.EVENT:
                        new EventTypesNode({
                            groupContents: this.value.contents,
                            index,
                            blockOptions: {
                                ...this.blockOptions,
                                ...this.value.blockOptions
                            },
                            value: method as StandardEventTypes
                        }).traverse(visitors)
                        break
                }
            } else {
                new BlockBoxOptionsNode({
                    groupContents: this.value.contents,
                    index,
                    blockOptions: null,
                    value: method
                }).traverse(visitors)
            }
        }
        exit(this, visitors.MethodGroup)
    }
}

export class MethodTypesNode extends TypesNode<StandardMethodTypes, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        entry(this, visitors.MethodTypes)
        exit(this, visitors.MethodTypes)
    }
}

export class EventTypesNode extends TypesNode<StandardEventTypes, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        entry(this, visitors.EventTypes)
        exit(this, visitors.EventTypes)
    }
}

export class BlockBoxOptionsNode extends TypesNode<BlockBoxOptions, StandardMethodsItem> {
    public override traverse(this: this, visitors: TypesVisitors): void {
        entry(this, visitors.BlockBoxOptions)
        exit(this, visitors.BlockBoxOptions)
    }
}

function entry<T extends TypesNode<unknown, unknown>>(node: T, visitor?: TypesNodeVisitor<T> | null | undefined): void {
    if (visitor == null) {
        return
    }
    if (typeof visitor == "function") {
        visitor(node)
    } else if (visitor.entry != null) {
        visitor.entry(node)
    }
}

function exit<T extends TypesNode<unknown, unknown>>(node: T, visitor?: TypesNodeVisitor<T> | null | undefined): void {
    if (visitor == null) {
        return
    }
    if (typeof visitor != "function" && visitor.exit != null) {
        visitor.exit(node)
    }
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

export function transformIcon(object?: { icon?: string | null | undefined } | null | undefined): void {
    if (object != null && object.icon != null) {
        object.icon = BUILD_IN_ICON_URL_MAP[object.icon] ?? object.icon
    }
}