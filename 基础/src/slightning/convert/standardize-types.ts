import { BooleanType, NumberType, StringEnumType, StringType, Type } from "../type"
import { BlockType, BriefType, DropdownItem, EventParamTypes, EventSubType, EventTypes, MethodBlock, MethodsTypes, PropertiesTypes, StandardDropdownItem, StandardEventParamTypes, StandardEventSubType, StandardEventTypes, StandardMethodBlock, StandardMethodsTypes, StandardMethodTypes, StandardPropertiesTypes, StandardTypes, Types, UnclearBriefEventTypes } from "../types"

export function standardizeTypes(types: Types): StandardTypes {
    return {
        ...types,
        properties: standardizeProperties(types.properties),
        methods: [
            ...types.events.map(standardizeEvent),
            {
                space: 40
            },
            ...standardizeMethods(types.methods)
        ],
        events: []
    }
}

export function standardizeProperties(properties: PropertiesTypes): StandardPropertiesTypes {
    const result: StandardPropertiesTypes = []
    for (const property of properties) {
        if ("contents" in property) {
            result.push({
                ...property,
                contents: standardizeProperties(property.contents)
            })
            continue
        }
        if (Array.isArray(property)) {
            result.push({
                key: property[0],
                label: property[1],
                type: inferType(property[2]),
                blockOptions: property[3]?.blockOptions
            })
        } else {
            result.push(property)
        }
    }
    return result
}

export function standardizeMethods(methods: MethodsTypes): StandardMethodsTypes {
    const result: StandardMethodsTypes = []
    for (const method of methods) {
        if ("contents" in method) {
            result.push({
                ...method,
                contents: standardizeMethods(method.contents)
            })
        } else if (Array.isArray(method)) {
            if (!(method[0] instanceof BlockType)) {
                method.unshift(BlockType.METHOD)
            }
            switch (method[0]) {
                case BlockType.METHOD:
                    const standardized: StandardMethodTypes = {
                        type: BlockType.METHOD,
                        key: method[1],
                        label: method[2] as string,
                        block: standardizeMethodBlock(method[3] as MethodBlock),
                        returns: inferType(method[4] as BriefType),
                        ...method[5]
                    }
                    result.push(standardized)
                    break
                case BlockType.EVENT:
                    result.push(standardizeEvent(method as EventTypes))
                    break
            }
        } else if ("key" in method) {
            if (method.type == null || method.type == BlockType.METHOD) {
                result.push({
                    ...method,
                    type: BlockType.METHOD,
                    block: standardizeMethodBlock((method as StandardMethodTypes).block)
                })
            } else {
                result.push(standardizeEvent(method as EventTypes))
            }
        } else {
            result.push(method)
        }
    }
    return result
}

export function standardizeMethodBlock(block: MethodBlock): StandardMethodBlock {
    const result: StandardMethodBlock = []
    for (const item of block) {
        if (typeof item == "string") {
            result.push(item)
        } else if (Array.isArray(item)) {
            result.push({
                key: item[0],
                label: item[1],
                type: inferType(item[2])
            })
        } else {
            result.push(item)
        }
    }
    return result
}

export function standardizeEvent(event: EventTypes): StandardEventTypes {
    if (Array.isArray(event)) {
        if (event[0] instanceof BlockType) {
            event = event.slice(1) as UnclearBriefEventTypes
        }
        if (Array.isArray(event[3])) {
            return {
                type: BlockType.EVENT,
                key: event[0] as string,
                label: event[1],
                subTypes: (event[2] as EventSubType[]).map(standardizeEventSubType),
                params: (event[3] as EventParamTypes[]).map(standardizeEventParam),
                ...event[4]
            }
        } else {
            return {
                type: BlockType.EVENT,
                key: event[0] as string,
                label: event[1],
                params: (event[2] as EventParamTypes[]).map(standardizeEventParam),
                ...event[3]
            }
        }
    } else {
        return {
            ...event,
            type: BlockType.EVENT,
            subTypes: event.subTypes?.map(standardizeEventSubType),
            params: event.params.map(standardizeEventParam)
        }
    }
}

export function standardizeEventSubType(subType: EventSubType): StandardEventSubType {
    if (Array.isArray(subType)) {
        return {
            key: subType[0],
            dropdown: subType[1].map(standardizeDropdownItem)
        }
    }
    return {
        ...subType,
        dropdown: subType.dropdown.map(standardizeDropdownItem)
    }
}

export function standardizeEventParam(param: EventParamTypes): StandardEventParamTypes {
    if (Array.isArray(param)) {
        return {
            key: param[0],
            label: param[1],
            type: inferType(param[2])
        }
    } else {
        return param
    }
}

export function standardizeDropdownItem(item: DropdownItem): StandardDropdownItem {
    if (Array.isArray(item)) {
        return {
            label: item[0],
            value: item[1]
        }
    }
    return item
}

function inferType(
    typeOrDefaultValue: BriefType
): Type {
    switch (typeof typeOrDefaultValue) {
        case "string":
            return new StringType(typeOrDefaultValue)
        case "number":
            return new NumberType(typeOrDefaultValue)
        case "boolean":
            return new BooleanType(typeOrDefaultValue)
        default:
            if (Array.isArray(typeOrDefaultValue)) {
                return new StringEnumType(typeOrDefaultValue)
            }
            return typeOrDefaultValue
    }
}
