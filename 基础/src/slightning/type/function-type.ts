import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { standardizeMethodBlock } from "../convert/standardize-types"
import { MethodBlock, StandardMethodBlock } from "../types"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"
import { VoidType } from "./void-type"

export class FunctionType<A extends unknown[], R> implements Type<(...args: A) => R> {

    public readonly block: StandardMethodBlock
    public readonly returns?: Type | null | undefined
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
        returns?: Type | null | undefined
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

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue ?? typeToString(this))
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue ?? typeToString(this))
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

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue ?? typeToString(this)
        }
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
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
            defaultValue: this.defaultValue ?? typeToString(this)
        }
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }
}
