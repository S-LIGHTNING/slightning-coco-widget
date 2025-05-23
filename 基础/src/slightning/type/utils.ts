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
import { InstanceType } from "./instance-type"
import { FunctionType } from "./function-type"

export function validate<T>(name: string | null, value: unknown, type: Type<T>): value is T {
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
        message = `不能将 ${betterToString(value)} 分配给 ${type.toString()}`
    }
    if (message != null) {
        if (name != null) {
            message = `${name}：${message}`
        }
        throw new TypeValidateError<T>(message, value, type)
    }
    return true
}

export function typeToString<T>(type: Type<T>, rules: stringify.Rule<Type<T>>[] = []): string {
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
                toString(data: ObjectType<{}>, __config: stringify.RequiredConfig): string {
                    let result: string = "字典"
                    if (data.propertiesType != null) {
                        const properties: string = Object.entries<Type<T[keyof T]>>(data.propertiesType)
                            .map(([key, type]: [string, Type<T[keyof T]>]): string => `${key}: ${type.toString()}`)
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
                toString(data: ArrayType<unknown>, __config: stringify.RequiredConfig): string {
                    let result: string = "列表"
                    if (data.itemType != null) {
                        result += `<${data.itemType.toString()}>`
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
                toString(data: UnionType<unknown>, __config: stringify.RequiredConfig): string {
                    return `(${data.types.map((type: Type<unknown>): string => typeToString(type)).join(" | ")})`
                }
            }, {
                test(data: unknown): data is InstanceType<unknown> {
                    return data instanceof InstanceType
                },
                toString(data: InstanceType<unknown>, __config: stringify.RequiredConfig): string {
                    return `[Object ${data.theClass.name}]`
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
                toString(data: FunctionType<unknown[], unknown>, __config: stringify.RequiredConfig): string {
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
                        result += `${part.label}: ${part.type.toString()}`
                    }
                    result += `) => ${(data.returns ?? new VoidType()).toString()}`
                    if (data.throws != null) {
                        result += ` 抛出 ${data.throws.toString()}`
                    }
                    return result
                }
            }
        ]
    })
}
