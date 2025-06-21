import * as stringify from "@slightning/anything-to-string"

type EscapeRule = {
    search: RegExp
    replace: string
}

const EscapeRuleArray: EscapeRule[] = [
    { search: /\&/g, replace: "	&amp;" },
    { search: /"/g, replace: "&quot;" },
    { search: /</g, replace: "&lt;" },
    { search: />/g, replace: "&gt;" },
    { search: / /g, replace: "&nbsp;" },
    { search: /　/g, replace: "&emsp;" },
    { search: / /g, replace: "&ensp;" },
    { search: /\n/g, replace: "<br>" }
]

export function HTMLEscape(text: string): string {
    for (const rule of EscapeRuleArray) {
        text = text.replace(rule.search, rule.replace)
    }
    return text
}

export function betterToString(data: unknown): string {
    return stringify.default(data, {
        rules: [new class extends stringify.LesserObjectRule {
            public constructor() {
                super()
            }
            public override test(data: unknown): data is {} {
                return super.test(data) && data != null && !Array.isArray(data)
            }
            public override toString(
                this: this,
                data: {},
                config: stringify.RequiredConfig,
                context: stringify.ToStringContext
            ): string {
                return super.toString(new Proxy(data, {
                    ownKeys(target: {}): (string | symbol)[] {
                        return Reflect.ownKeys(target).sort(
                            (a: string | symbol, b: string | symbol): number => {
                                if (typeof a == "symbol" && typeof b == "symbol") {
                                    a = a.toString()
                                    b = b.toString()
                                }
                                if (a === b) {
                                    return 0
                                }
                                if (typeof a == "string" && typeof b == "string") {
                                    return a < b ? -1 : 1
                                }
                                return typeof a == "string" ? -1 : 1
                            }
                        )
                    }
                }), config, context)
            }
        }(), ...stringify.Rules.LESSER],
        depth: Infinity,
        indent: 2
    })
}
