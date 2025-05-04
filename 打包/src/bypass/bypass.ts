import type { ClassMethod, ClassProperty, Comment, Declaration, ExportNamedDeclaration, ExportSpecifier, Expression, File, Identifier, ImportSpecifier, MemberExpression, Node, ObjectMethod, ObjectProperty, StringLiteral, TemplateElement, TemplateLiteral, VariableDeclaration } from "@babel/types"

import { parse, ParseResult } from "@babel/parser"
import traverse, { NodePath } from "@babel/traverse"
import generate from "@babel/generator"

export type Bypass = {
    replace?: string | null | undefined
    importSource?: string | null | undefined
}

export type BypassMap = Record<string, Bypass>

export const BYPASS_MAP: BypassMap = {
    "XMLHttpRequest": {
        replace: "XML_Http_Request",
        importSource: "slightning-coco-widget--webpack/bypass/xml-http-request"
    },
    "XMLHttpRequestEventTarget": {
        replace: "XML_Http_RequestEventTarget",
        importSource: "slightning-coco-widget--webpack/bypass/xml-http-request-event-target"
    },
    "fetch": {
        importSource: "slightning-coco-widget--webpack/bypass/fetch"
    },
    ".fetch": {
        replace: "._fetch",
        importSource: "slightning-coco-widget--webpack/bypass/fetch"
    },
    "WebSocket": {
        replace: "Web_Socket",
        importSource: "slightning-coco-widget--webpack/bypass/web-socket"
    },
    "WebSocketError": {
        replace: "Web_SocketError",
        importSource: "slightning-coco-widget--webpack/bypass/web-socket-error"
    },
    "WebSocketStream": {
        replace: "Web_SocketStream",
        importSource: "slightning-coco-widget--webpack/bypass/web-socket-stream"
    },
    "socketcv.codemao.cn": {
        replace: "socketcv_.codemao_.cn"
    }
}

export function includesKeyWords(value: string): boolean {
    return Object.keys(BYPASS_MAP).some((name: string): boolean => {
        return value.includes(name)
    })
}

export function replaceKeyWordsInString(value: string): string {
    for (const [search, bypass] of Object.entries(BYPASS_MAP)) {
        if (bypass.replace != null) {
            value = value.split(search).join(bypass.replace)
        }
    }
    return value
}

export function bypassAddImport(source: string): string {
    if (!includesKeyWords(source)) {
        return source
    }
    const AST: ParseResult<File> = parse(source, {
        sourceType: "unambiguous"
    })
    ASTBypassAddImport(AST)
    return generate(AST).code
}

export function ASTBypassAddImport(AST: File): void {

    const imports: Record<string, string> = {}

    function getAllImportNames(node: File): string[] {
        const result: string[] = []
        for (const subNode of node.program.body) {
            if (subNode.type == "ImportDeclaration" && subNode.importKind == "value") {
                for (const specifier of subNode.specifiers) {
                    result.unshift(specifier.local.name)
                }
            }
        }
        return result
    }

    function addImport(node: File): void {
        const importNames: string[] = getAllImportNames(node)
        for (const [name, source] of Object.entries(imports)) {
            if (!importNames.includes(name)) {
                node.program.body.unshift({
                    type: "ImportDeclaration",
                    specifiers: [
                        {
                            type: "ImportDefaultSpecifier",
                            local: {
                                type: "Identifier",
                                name
                            }
                        }
                    ],
                    importKind: "value",
                    source: {
                        type: "StringLiteral",
                        value: source
                    }
                })
            }
        }
    }

    traverse(AST, {
        Identifier(path: NodePath<Identifier>): void {
            if (![
                "ImportSpecifier",
                "ExportSpecifier",
                "ObjectProperty",
                "ObjectMethod",
                "ClassProperty",
                "ClassMethod"
            ].includes(path.parent.type)) {
                const { node } = path
                const bypass: Bypass | undefined = BYPASS_MAP[node.name]
                if (bypass != null && bypass.importSource != null) {
                    imports[node.name] = bypass.importSource
                }
            }
        }
    })
    addImport(AST)
}

export function bypassKeyWordsCheck(source: string): string {
    if (!includesKeyWords(source)) {
        return source
    }
    const AST: ParseResult<File> = parse(source, {
        sourceType: "unambiguous"
    })
    ASTBypassKeyWordsCheck(AST)
    return generate(AST).code
}

export function ASTBypassKeyWordsCheck(AST: Node): void {

    function getDeclarationNames(path: NodePath<Declaration>): string[] {
        const { node } = path
        const result: string[] = []
        if (node.type == "VariableDeclaration") {
            for(const subPath of (path as NodePath<VariableDeclaration>).get("declarations")) {
                const idPath = subPath.get("id")
                if (idPath.node.type == "Identifier") {
                    result.push(idPath.node.name)
                } else {
                    idPath.traverse({
                        Identifier(path: NodePath<Identifier>): void {
                            const { parent, node } = path
                            if (parent.type == "ObjectProperty" && node == parent.key) {
                                return
                            }
                            result.push(node.name)
                        }
                    })
                }
            }
        } else if (node.type == "FunctionDeclaration") {
            if (node.id?.type == "Identifier") {
                result.push(node.id.name)
            }
        } else if (node.type == "ClassDeclaration") {
            if (node.id?.type == "Identifier") {
                result.push(node.id.name)
            }
        }
        return result
    }

    function setKeyComputed(path: NodePath<ObjectProperty | ObjectMethod | ClassMethod | ClassProperty>): void {
        const { node } = path
        if (!node.computed) {
            if (node.key.type == "Identifier" && includesKeyWords(node.key.name)) {
                node.key = {
                    type: "StringLiteral",
                    value: node.key.name
                }
                node.computed = true
            } else if (node.key.type == "StringLiteral" && includesKeyWords(node.key.value)) {
                node.computed = true
            }
        }
    }

    function replaceInIdentifier(path: NodePath<Identifier>): void {
        const { node } = path
        node.name = replaceKeyWordsInString(node.name)
    }

    function replaceInComment(node: Node): void {
        const comments: Comment[] | null | undefined = node.leadingComments ?? node.innerComments ?? node.trailingComments
        if (comments != null) {
            for (const comment of comments) {
                comment.value = replaceKeyWordsInString(comment.value)
            }
        }
    }

    function getReplaceNode(bypass: Bypass): Expression {
        return {
            type: "CallExpression",
            callee: {
                type: "MemberExpression",
                object: {
                    type: "StringLiteral",
                    value: bypass.replace ?? ""
                },
                computed: false,
                property: {
                    type: "Identifier",
                    name: "replace"
                }
            },
            arguments: [
                {
                    type: "RegExpLiteral",
                    pattern: "_",
                    flags: "g"
                }, {
                    type: "StringLiteral",
                    value: ""
                }
            ]
        }
    }

    traverse(AST, {
        ImportSpecifier(path: NodePath<ImportSpecifier>): void {
            replaceInIdentifier(path.get("local"))
        },
        ExportSpecifier(path: NodePath<ExportSpecifier>): void {
            replaceInIdentifier(path.get("local"))
        },
        ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>): void {
            const { node } = path
            const declaration = path.get("declaration")
            if (declaration.node != null) {
                path.insertBefore(declaration.node)
                node.declaration = null
                node.specifiers.push(...getDeclarationNames(declaration as NodePath<Declaration>).map(
                    (name: string): ExportSpecifier => {
                        return {
                            type: "ExportSpecifier",
                            local: {
                                type: "Identifier",
                                name
                            },
                            exported: {
                                type: "Identifier",
                                name
                            }
                        }
                    }
                ))
            }
        },
        ObjectProperty: setKeyComputed,
        ObjectMethod: setKeyComputed,
        ClassProperty: setKeyComputed,
        ClassMethod: setKeyComputed,
        MemberExpression(path: NodePath<MemberExpression>): void {
            const { node } = path
            if (!node.computed) {
                if (node.property.type == "Identifier" && includesKeyWords(node.property.name)) {
                    node.property = {
                        type: "StringLiteral",
                        value: node.property.name
                    }
                    node.computed = true
                } else if (node.property.type == "StringLiteral" && includesKeyWords(node.property.value)) {
                    node.computed = true
                }
            }
        },
        enter(path: NodePath): void {
            const { node } = path
            replaceInComment(node)
        },
        Identifier(path: NodePath<Identifier>): void {
            if (![
                "ImportSpecifier",
                "ExportSpecifier",
                "ObjectProperty",
                "ObjectMethod",
                "ClassProperty",
                "ClassMethod"
            ].includes(path.parent.type)) {
                replaceInIdentifier(path)
            }
        },
        StringLiteral(path: NodePath<StringLiteral>): void {
            const { parent, node } = path
            if (parent.type != "ImportDeclaration") {
                for (const [name, bypass] of Object.entries(BYPASS_MAP)) {
                    if (bypass.replace == null) {
                        continue
                    }
                    if (node.value.includes(name)) {
                        const strings: string[] = node.value.split(name)
                        path.replaceWith({
                            type: "StringLiteral",
                            value: strings.shift() ?? ""
                        })
                        while (strings.length > 0) {
                            path.replaceWith({
                                type: "BinaryExpression",
                                left: {
                                    type: "BinaryExpression",
                                    left: path.node,
                                    operator: "+",
                                    right: getReplaceNode(bypass)
                                },
                                operator: "+",
                                right: {
                                    type: "StringLiteral",
                                    value: strings.shift() ?? ""
                                }
                            })
                        }
                        return
                    }
                }
            }
        },
        TemplateLiteral(path: NodePath<TemplateLiteral>): void {
            const { node } = path
            for (const [name, bypass] of Object.entries(BYPASS_MAP)) {
                if (bypass.replace == null) {
                    continue
                }
                for (let i: number = node.quasis.length - 1; i >= 0; i--) {
                    const parts: string[] = node.quasis[i]!.value.raw.split(name)
                    node.quasis.splice(i, 1, ...parts.map((part: string): TemplateElement => ({
                        type: "TemplateElement",
                        value: {
                            raw: part
                        },
                        tail: false
                    })))
                    for (let j: number = 1; j < parts.length; j++) {
                        node.expressions.splice(i, 0, getReplaceNode(bypass))
                    }
                }
            }
        }
    })
    replaceInComment(AST)
}

export function bypassRestrictions(source: string): string {
    if (!includesKeyWords(source)) {
        return source
    }
    const AST: ParseResult<File> = parse(source, {
        sourceType: "unambiguous"
    })
    ASTBypassAddImport(AST)
    ASTBypassKeyWordsCheck(AST)
    return generate(AST).code
}
