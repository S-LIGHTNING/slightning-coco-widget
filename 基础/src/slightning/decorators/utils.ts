import { FunctionType, VoidType } from "../type"
import { MethodBlockParam, MethodParamTypes } from "../types"

export function methodParamNeedsTransformToEvent(
    part: string | MethodBlockParam | MethodParamTypes
): part is MethodParamTypes & {
    type: FunctionType<unknown[], unknown>
} {
    if (typeof part != "object") {
        return false
    }
    return part.type instanceof FunctionType && !part.type.raw
}

export function methodParamNeedsTransformToCodeBlocks(
    part: string | MethodBlockParam | MethodParamTypes
): part is MethodParamTypes & {
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
