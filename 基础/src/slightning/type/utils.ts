import * as stringify from "@slightning/anything-to-string"
import { betterToString } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { VoidType } from "./void-type"
import { StringType } from "./string-type"
import { IntegerType } from "./integer-type"
import { NumberType } from "./number-type"
import { BooleanType } from "./boolean-type"
import { AnyType } from "./any-type"
import { StringEnumType } from "./string-enum-type"
import { ObjectType } from "./object-type"
import { ArrayType } from "./array-type"
import { ColorType } from "./color-type"
import { ImageType } from "./image-type"
import { AudioType } from "./audio-type"
import { UnionType } from "./union-type"
import { VideoType } from "./video-type"
import { InstanceOfClassType } from "./instance-of-class-type"
import { FunctionType } from "./function-type"

export function validate<T>(name: string | null, value: unknown, type: Type<T>): asserts value is T {
    let message: string | null = null, result: boolean = false
    try {
        result = type.validate(value)
    } catch (error) {
        if (!(error instanceof TypeValidateError)) {
            throw error
        }
        message = error.message
    }
    if (!result && message == null) {
        message = `不能将 ${betterToString(value)} 分配给 ${typeToString(type)}`
    }
    if (message != null) {
        if (name != null) {
            message = `${name}：${message}`
        }
        throw new TypeValidateError<T>(message, value, type)
    }
}

export function typeToString(type: Type<unknown>, rules: stringify.Rule<Type<unknown>>[] = []): string {
    return stringify.default(type, {
        rules: [
            ...rules, {
                test(data: unknown): data is VoidType {
                    return data instanceof VoidType
                },
                toString(__data: VoidType, __config: stringify.RequiredConfig): string {
                    return "无"
                }
            }, {
                test(data: unknown): data is StringType {
                    return data instanceof StringType
                },
                toString(__data: StringType, __config: stringify.RequiredConfig): string {
                    return "字符串"
                }
            }, {
                test(data: unknown): data is IntegerType {
                    return data instanceof IntegerType
                },
                toString(data: IntegerType, __config: stringify.RequiredConfig): string {
                    let result: string = "整数"
                    if (data.range != null) {
                        result += data.range.toString()
                    }
                    return result
                }
            }, {
                test(data: unknown): data is NumberType {
                    return data instanceof NumberType
                },
                toString(data: NumberType, __config: stringify.RequiredConfig): string {
                    let result: string = "数字"
                    if (data.range != null) {
                        result += data.range.toString()
                    }
                    return result
                }
            }, {
                test(data: unknown): data is BooleanType {
                    return data instanceof BooleanType
                },
                toString(__data: BooleanType, __config: stringify.RequiredConfig): string {
                    return "布尔"
                }
            }, {
                test(data: unknown): data is AnyType {
                    return data instanceof AnyType
                },
                toString(__data: AnyType, __config: stringify.RequiredConfig): string {
                    return "任意"
                }
            }, {
                test(data: unknown): data is StringEnumType<string> {
                    return data instanceof StringEnumType
                },
                toString(data: StringEnumType<string>, __config: stringify.RequiredConfig): string {
                    return `(${data.values.map((value: string): string => JSON.stringify(value)).join(" | ")})`
                }
            }, {
                test(data: unknown): data is ObjectType<{}> {
                    return data instanceof ObjectType
                },
                prepare(
                    data: ObjectType<{}>,
                    config: stringify.RequiredConfig,
                    context: stringify.PrepareContext
                ): void {
                    if (data.propertiesType != null) {
                        for (const propertyType of Object.values(data.propertiesType)) {
                            new stringify.AnythingRule().prepare(propertyType, config, context)
                        }
                    }
                },
                toString(
                    data: ObjectType<{}>,
                    config: stringify.RequiredConfig,
                    context: stringify.ToStringContext
                ): string {
                    let result: string = "字典"
                    if (data.propertiesType != null) {
                        const properties: string = Object.entries<Type<unknown>>(data.propertiesType)
                            .map(([key, type]: [string, Type<unknown>]): string => `${key}: ${new stringify.AnythingRule().toString(type, config, context)}`)
                            .join("\n")
                        result += ` {\n${properties}\n}`
                    }
                    return result
                }
            }, {
                test(data: unknown): data is ArrayType<unknown> {
                    return data instanceof ArrayType
                },
                prepare(
                    data: ArrayType<unknown>,
                    config: stringify.RequiredConfig,
                    context: stringify.PrepareContext
                ): void {
                    if (data.itemType != null) {
                        new stringify.AnythingRule().prepare(data.itemType, config, context)
                    }
                },
                toString(
                    data: ArrayType<unknown>,
                    config: stringify.RequiredConfig,
                    context: stringify.ToStringContext
                ): string {
                    let result: string = "列表"
                    if (data.itemType != null) {
                        result += `<${new stringify.AnythingRule().toString(data.itemType, config, context)}>`
                    }
                    return result
                }
            }, {
                test(data: unknown): data is ColorType {
                    return data instanceof ColorType
                },
                toString(__data: ColorType, __config: stringify.RequiredConfig): string {
                    return "颜色"
                }
            }, {
                test(data: unknown): data is ImageType {
                    return data instanceof ImageType
                },
                toString(__data: ImageType, __config: stringify.RequiredConfig): string {
                    return "图像"
                }
            }, {
                test(data: unknown): data is AudioType {
                    return data instanceof AudioType
                },
                toString(__data: AudioType, __config: stringify.RequiredConfig): string {
                    return "音频"
                }
            }, {
                test(data: unknown): data is VideoType {
                    return data instanceof VideoType
                },
                toString(__data: VideoType, __config: stringify.RequiredConfig): string {
                    return "视频"
                }
            }, {
                test(data: unknown): data is UnionType<unknown> {
                    return data instanceof UnionType
                },
                prepare(
                    data: UnionType<unknown>,
                    config: stringify.RequiredConfig,
                    context: stringify.PrepareContext
                ): void {
                    for (const type of data.types) {
                        new stringify.AnythingRule().prepare(type, config, context)
                    }
                },
                toString(
                    data: UnionType<unknown>,
                    config: stringify.RequiredConfig,
                    context: stringify.ToStringContext
                ): string {
                    return `(${data.types.map((type: Type<unknown>): string => new stringify.AnythingRule().toString(type, config, context)).join(" | ")})`
                }
            }, {
                test(data: unknown): data is InstanceOfClassType<unknown> {
                    return data instanceof InstanceOfClassType
                },
                toString(data: InstanceOfClassType<unknown>, __config: stringify.RequiredConfig): string {
                    return `实例<${data.theClass.name}>`
                }
            }, {
                test(data: unknown): data is FunctionType<unknown[], unknown> {
                    return data instanceof FunctionType
                },
                prepare(
                    data: FunctionType<unknown[], unknown>,
                    config: stringify.RequiredConfig,
                    context: stringify.PrepareContext
                ): void {
                    if (data.block != null) {
                        for (const part of data.block) {
                            if (typeof part != "object") {
                                continue
                            }
                            new stringify.AnythingRule().prepare(part.type, config, context)
                        }
                    }
                    if (data.returns != null) {
                        new stringify.AnythingRule().prepare(data.returns, config, context)
                    }
                    if (data.throws != null) {
                        new stringify.AnythingRule().prepare(data.throws, config, context)
                    }
                },
                toString(
                    data: FunctionType<unknown[], unknown>,
                    config: stringify.RequiredConfig,
                    context: stringify.ToStringContext
                ): string {
                    let result: string = "("
                    let isFirst: boolean = true
                    for (const part of data.block) {
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
                    result += `) => ${new stringify.AnythingRule().toString(data.returns ?? new VoidType(), config, context)}`
                    if (data.throws != null) {
                        result += ` 抛出 ${new stringify.AnythingRule().toString(data.throws, config, context)}`
                    }
                    return result
                }
            }
        ]
    })
}

export function inlineTypeToString(type: Type<unknown>, rules: stringify.Rule<Type<unknown>>[] = []): string {
    return typeToString(type, [
        ...rules, {
            test(data: unknown): data is ObjectType<{}> {
                return data instanceof ObjectType
            },
            prepare(
                data: ObjectType<{}>,
                config: stringify.RequiredConfig,
                context: stringify.PrepareContext
            ): void {
                if (data.propertiesType != null) {
                    for (const propertyType of Object.values(data.propertiesType)) {
                        new stringify.AnythingRule().prepare(propertyType, config, context)
                    }
                }
            },
            toString(
                data: ObjectType<{}>,
                config: stringify.RequiredConfig,
                context: stringify.ToStringContext
            ): string {
                let result: string = "字典"
                if (data.propertiesType != null) {
                    const properties: string = Object.entries<Type<unknown>>(data.propertiesType)
                        .map(([key, type]: [string, Type<unknown>]): string => `${key}: ${
                            new stringify.AnythingRule().toString(type, config, context)
                        }`)
                        .join("; ")
                    result += ` { ${properties} }`
                }
                return result
            }
        }
    ])
}
