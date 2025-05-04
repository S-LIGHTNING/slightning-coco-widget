import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { MethodBlockTypes } from "../types"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { VoidType } from "./void-type"

export class FunctionType<A extends unknown[], R> implements Type<(...args: A) => R> {

    public readonly block: MethodBlockTypes
    public readonly returns?: Type | null | undefined
    public readonly throws?: Type | null | undefined
    public readonly defaultValue?: string | null | undefined
    public readonly raw: boolean

    public constructor({
        block,
        returns,
        throws,
        defaultValue,
        raw
    }: {
        block: MethodBlockTypes
        returns?: Type | null | undefined
        throws?: Type | null | undefined
        defaultValue?: string | null | undefined
        raw?: boolean | null | undefined
    }) {
        this.block = block
        this.returns = returns
        this.throws = throws
        this.defaultValue = defaultValue
        this.raw = raw ?? false
    }

    public toString(): string {
        let result: string = "("
        let isFirst: boolean = true
        for (const part of this.block) {
            if (typeof part != "object") {
                continue
            }
            if (isFirst) {
                isFirst = false
            } else {
                result += ", "
            }
            result += `${part.label}: ${part.type.toString()}`
        }
        result += `) => ${(this.returns ?? new VoidType()).toString()}`
        if (this.throws != null) {
            result += ` 抛出 ${this.throws.toString()}`
        }
        return result
    }

    public validate(value: unknown): value is (...args: A) => R {
        if (typeof value != "function") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${this.toString()}`, value, this)
        }
        return true
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue ?? this.toString())
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue ?? this.toString())
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue ?? this.toString()
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        if (
            !this.raw &&
            (this.returns == null || this.returns instanceof VoidType) &&
            (this.throws == null || this.throws instanceof VoidType)
        ) {
            const codeParams: CreationProject.MethodParamCodeParamTypes[] = []
            for (const part of this.block) {
                if (typeof part != "object") {
                    continue
                }
                codeParams.push({
                    key: part.key,
                    label: part.label,
                    ...part.type.toCreationProjectEmitParamValueTypes()
                })
            }
            return {
                valueType: "code",
                codeParams
            }
        }
        return {
            valueType: "object",
            defaultValue: this.defaultValue ?? this.toString()
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }
}
