import type * as tStringify from "@slightning/anything-to-string"

import { betterToString, stringify } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"
import { RuntimeVoidType } from "./void-type"

export interface RuntimeFunctionTypeProps<A extends unknown[] = unknown[], R = unknown> {
    params: { label: string; type: RuntimeType<ItemType<A>> }[]
    returns?: RuntimeType<R> | null | undefined
    throws?: RuntimeType | null | undefined
}

type ItemType<T extends unknown[]> = T extends (infer U)[] ? U : never

export class RuntimeFunctionType<A extends unknown[] = unknown[], R = unknown> implements RuntimeType<(...args: A) => R> {

    public readonly params: { label: string; type: RuntimeType<ItemType<A>> }[]
    public readonly returns?: RuntimeType<R> | null | undefined
    public readonly throws?: RuntimeType | null | undefined

    public constructor(props: RuntimeFunctionTypeProps<A, R>) {
        this.params = props.params
        this.returns = props.returns
        this.throws = props.throws
    }

    public validate(this: this, value: unknown): value is (...args: A) => R {
        if (typeof value != "function") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public typeToStringPrepare(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.PrepareContext
    ): void {
        for (const param of this.params) {
            new stringify.AnythingRule().prepare(param.type, config, context)
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
        config: tStringify.RequiredConfig,
        context: tStringify.ToStringContext
    ): string {
        let result: string = "("
        let isFirst: boolean = true
        for (const param of this.params) {
            if (isFirst) {
                isFirst = false
            } else {
                result += ", "
            }
            result += `${param.label}: ${new stringify.AnythingRule().toString(param.type, config, context)}`
        }
        result += `) => ${new stringify.AnythingRule().toString(this.returns ?? new RuntimeVoidType(), config, context)}`
        if (this.throws != null) {
            result += ` 抛出 ${new stringify.AnythingRule().toString(this.throws, config, context)}`
        }
        return result
    }

    public inlineTypeToStringPrepare(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.PrepareContext
    ): void {
        this.typeToStringPrepare(config, context)
    }

    public inlineTypeToString(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.ToStringContext
    ): string {
        return this.typeToString(config, context)
    }
}
