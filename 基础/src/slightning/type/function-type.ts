import * as stringify from "@slightning/anything-to-string"

import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { betterToString, XMLEscape } from "../../utils"
import { standardizeMethodBlock } from "../convert/standardize-types"
import { MethodBlock, StandardMethodBlock } from "../types"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { inlineTypeToString, typeToString } from "./utils"
import { VoidType } from "./void-type"

export class FunctionType<A extends unknown[], R> implements Type<(...args: A) => R> {

    public readonly block: StandardMethodBlock
    public readonly returns?: Type<R> | null | undefined
    public readonly throws?: Type | null | undefined
    public readonly defaultValue?: string | null | undefined
    public readonly raw: boolean

    /**
     * @param block 函数对应的积木，类似于控件方法类型定义中的 `block` 属性。
     * @param returns 返回值类型。
     * @param throws 抛出异常类型。
     * @param raw 是否保持原始，若为时，则不会被装饰器转换。
     */
    public constructor({
        block, returns, throws, defaultValue, raw
    }: {
        block: MethodBlock
        returns?: Type<R> | null | undefined
        throws?: Type | null | undefined
        defaultValue?: string | null | undefined
        raw?: boolean | null | undefined
    }) {
        this.block = standardizeMethodBlock(block)
        this.returns = returns
        this.throws = throws
        this.defaultValue = defaultValue
        this.raw = raw ?? false
    }

    public validate(this: this, value: unknown): value is (...args: A) => R {
        if (typeof value != "function") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        const result: {
            key: string
            label: string
            type: Type
        }[] = []
        if (this.returns != null) {
            result.push({
                key: "__slightning_coco_widget_function_return_value__",
                label: "函数返回值",
                type: this.returns
            })
        }
        if (this.throws != null) {
            result.push({
                key: "__slightning_coco_widget_function_throw_value__",
                label: "函数抛出值",
                type: this.throws
            })
        }
        return result
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        const result: {
            key: string
            label: string
            type: Type
        }[] = []
        for (const part of this.block) {
            if (typeof part != "object") {
                continue
            }
            result.push({
                key: `__slightning_coco_widget_function_param__${part.key}`,
                label: `函数参数·${part.label}`,
                type: part.type
            })
        }
        return result
    }

    public isVoid(this: this): boolean {
        return false
    }

    public typeToStringPrepare(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void {
        if (this.block != null) {
            for (const part of this.block) {
                if (typeof part != "object") {
                    continue
                }
                new stringify.AnythingRule().prepare(part.type, config, context)
            }
        }
        if (this.returns != null) {
            new stringify.AnythingRule().prepare(this.returns, config, context)
        }
        if (this.throws != null) {
            new stringify.AnythingRule().prepare(this.throws, config, context)
        }
    }

    public typeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string {
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
            result += `${part.label}: ${new stringify.AnythingRule().toString(part.type, config, context)}`
        }
        result += `) => ${new stringify.AnythingRule().toString(this.returns ?? new VoidType(), config, context)}`
        if (this.throws != null) {
            result += ` 抛出 ${new stringify.AnythingRule().toString(this.throws, config, context)}`
        }
        return result
    }

    public inlineTypeToStringPrepare(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void {
        this.typeToStringPrepare(config, context)
    }

    public inlineTypeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string {
        return this.typeToString(config, context)
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue ?? inlineTypeToString(this))
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue ?? inlineTypeToString(this))
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
        }
    }

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue ?? inlineTypeToString(this)
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        if (
            !this.raw &&
            (this.returns == null || this.returns.isVoid()) &&
            (this.throws == null || this.throws.isVoid())
        ) {
            const codeParams: CreationProject1.MethodParamCodeParamTypes[] = []
            for (const part of this.block) {
                if (typeof part != "object") {
                    continue
                }
                codeParams.push({
                    key: part.key,
                    label: part.label,
                    ...part.type.toCreationProject1EmitParamValueTypes()
                })
            }
            return {
                valueType: "code",
                codeParams
            }
        }
        return {
            valueType: "object",
            defaultValue: this.defaultValue ?? inlineTypeToString(this)
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue ?? inlineTypeToString(this)
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        if (
            !this.raw &&
            (this.returns == null || this.returns.isVoid()) &&
            (this.throws == null || this.throws.isVoid())
        ) {
            const codeParams: CreationProject2.MethodParamCodeParamTypes[] = []
            for (const part of this.block) {
                if (typeof part != "object") {
                    continue
                }
                codeParams.push({
                    key: part.key,
                    label: part.label,
                    ...part.type.toCreationProject2EmitParamValueTypes()
                })
            }
            return {
                valueType: "code",
                codeParams
            }
        }
        return {
            valueType: "object",
            defaultValue: this.defaultValue ?? inlineTypeToString(this)
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }
}
