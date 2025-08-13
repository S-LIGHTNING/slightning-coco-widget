import * as CreationProject1 from "../../creation-project-1/type"
import * as CreationProject2 from "../../creation-project-2"
import { standardizeMethodBlock } from "../convert/standardize-types"
import { MethodBlock, MethodBlockParam, StandardMethodBlock, StandardMethodBlockItem } from "../types"
import { ArrayType } from "./array-type"
import { ObjectType } from "./object-type"

export class MutatorType<T extends {} = Record<string, unknown>> extends ArrayType<T> {

    public readonly block: StandardMethodBlock
    public readonly separators: (MethodBlockParam | string)[]
    /**
     * @deprecated 请使用 separators 代替。
     */
    public readonly separator: string
    public readonly min: number
    public readonly max: number
    public readonly defaultNumber: number
    public readonly transformMin: number
    public readonly transformMax: number

    public constructor({
        block, separators, separator, min, max, defaultNumber, transformMin, transformMax
    }: {
        block: MethodBlock
        separators?: (MethodBlockParam | string)[] | null | undefined
        /**
         * @deprecated 请使用 separators 代替。
         */
        separator?: string | null | undefined
        min?: number | null | undefined
        max?: number | null | undefined
        defaultNumber?: number | null | undefined
        transformMin?: number | null | undefined
        transformMax?: number | null | undefined
    }) {
        const standardBlock: StandardMethodBlock = standardizeMethodBlock(block)
        const propertiesType: any = {}
        for (const item of standardBlock) {
            if (typeof item == "object") {
                propertiesType[item.key] = item.type
            }
        }
        const itemType = new ObjectType<T>({ propertiesType })
        super({ itemType })
        this.block = standardBlock
        this.separators = separators ?? (typeof separator == "string" ? [separator] : [])
        this.separator = separator ?? separators?.join(" ") ?? ""
        this.min = min ?? 2
        this.max = max ?? Infinity
        this.defaultNumber = defaultNumber ?? this.min
        this.transformMin = transformMin ?? this.min
        this.transformMax = transformMax ?? Math.min(this.min + 5, this.max)
    }

    public override toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MutatorTypes {
        const mutator: CreationProject1.MethodParamTypes[] = []
        let mutatorLastParam: CreationProject1.MethodParamTypes | null = null
        let mutatorLabelsAfterLastParam: string[] = []
        function mutatorAddText(text: string): void {
            if (mutatorLastParam == null) {
                mutatorLabelsAfterLastParam.push(text)
            } else {
                if (mutatorLastParam.label == null) {
                    mutatorLastParam.label = text
                } else if (
                    mutatorLastParam.label.endsWith("\n") ||
                    text.startsWith("\n")
                ) {
                    mutatorLastParam.label += text
                } else {
                    mutatorLastParam.label += " " + text
                }
            }
        }
        const block: StandardMethodBlock = [...this.block, ...this.separators]
        let i: number = block.length - 1
        for (; i >= 0; i--) {
            const mutatorPart: StandardMethodBlockItem | undefined = block[i]
            if (mutatorPart == undefined) {
                continue
            }
            if (mutatorPart == MethodBlockParam.BREAK_LINE) {
                mutatorAddText("\n")
            } else if (typeof mutatorPart == "string") {
                mutatorAddText(mutatorPart)
            } else {
                mutatorLastParam = {
                    key: mutatorPart.key,
                    ...mutatorPart.type.toCreationProject1MethodParamValueTypes()
                }
                if (mutatorLabelsAfterLastParam.length > 0) {
                    mutatorLastParam.labelAfter = mutatorLabelsAfterLastParam.join(" ")
                    mutatorLabelsAfterLastParam = []
                }
                mutator.unshift(mutatorLastParam)
            }
        }
        return {
            valueType: "mutator",
            mutator,
            mutatorMin: this.min,
            mutatorMax: this.max,
            mutatorItem: this.defaultNumber
        }
    }

    public override toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MutatorTypes {
        const mutator: CreationProject2.MethodParamTypes[] = []
        let mutatorLastParam: CreationProject2.MethodParamTypes | null = null
        let mutatorLabelsAfterLastParam: string[] = []
        function mutatorAddText(text: string): void {
            if (mutatorLastParam == null) {
                mutatorLabelsAfterLastParam.push(text)
            } else {
                if (mutatorLastParam.label == null) {
                    mutatorLastParam.label = text
                } else if (
                    mutatorLastParam.label.endsWith("\n") ||
                    text.startsWith("\n")
                ) {
                    mutatorLastParam.label += text
                } else {
                    mutatorLastParam.label += " " + text
                }
            }
        }
        const block: StandardMethodBlock = [...this.block, ...this.separators]
        let i: number = block.length - 1
        for (; i >= 0; i--) {
            const mutatorPart: StandardMethodBlockItem | undefined = block[i]
            if (mutatorPart == undefined) {
                continue
            }
            if (mutatorPart == MethodBlockParam.BREAK_LINE) {
                mutatorAddText("\n")
            } else if (typeof mutatorPart == "string") {
                mutatorAddText(mutatorPart)
            } else {
                mutatorLastParam = {
                    key: mutatorPart.key,
                    ...mutatorPart.type.toCreationProject2MethodParamValueTypes()
                }
                if (mutatorLabelsAfterLastParam.length > 0) {
                    mutatorLastParam.labelAfter = mutatorLabelsAfterLastParam.join(" ")
                    mutatorLabelsAfterLastParam = []
                }
                mutator.unshift(mutatorLastParam)
            }
        }
        return {
            valueType: "mutator",
            mutator,
            mutatorMin: this.min,
            mutatorMax: this.max,
            mutatorItem: this.defaultNumber
        }
    }
}
