import * as t from "@babel/types"
import { parse, ParseResult } from "@babel/parser"
import traverse, { NodePath, Visitor } from "@babel/traverse"
import generate from "@babel/generator"
import * as template from "@babel/template"

export type Bypass = {
    replace?: string | null | undefined
    importSource?: string | null | undefined
}

export type BypassMap = Record<string, Bypass>

export const BYPASS_MAP: BypassMap = {
    "XMLHttpRequest": {
        replace: "XML_Http_Request",
        importSource: "slightning-coco-widget--webpack/runtime/bypass/xml-http-request"
    },
    "XMLHttpRequestEventTarget": {
        replace: "XML_Http_RequestEventTarget",
        importSource: "slightning-coco-widget--webpack/runtime/bypass/xml-http-request-event-target"
    },
    "fetch": {
        importSource: "slightning-coco-widget--webpack/runtime/bypass/fetch"
    },
    ".fetch": {
        replace: "._fetch"
    },
    "location": {},
    "parent.location": {
        replace: "parent._location"
    },
    "top.location": {
        replace: "top._location"
    },
    "WebSocket": {
        replace: "Web_Socket",
        importSource: "slightning-coco-widget--webpack/runtime/bypass/web-socket"
    },
    "WebSocketError": {
        replace: "Web_SocketError",
        importSource: "slightning-coco-widget--webpack/runtime/bypass/web-socket-error"
    },
    "WebSocketStream": {
        replace: "Web_SocketStream",
        importSource: "slightning-coco-widget--webpack/runtime/bypass/web-socket-stream"
    },
    "codemao": {},
    "socketcv.codemao.cn": {
        replace: "socketcv_.codemao_.cn"
    }
}

export const BYPASS_FULL_KEY_WORDS: string[] = Object.entries(BYPASS_MAP).filter(
    ([, bypass]: [string, Bypass]): boolean => bypass.replace != null
).map(([name]: [string, Bypass]): string => name)

export function includesFullKeyWords(value: string): boolean {
    return BYPASS_FULL_KEY_WORDS.some((name: string): boolean => {
        return value.includes(name)
    })
}

export const BYPASS_KEY_WORDS: string[] = Object.keys(BYPASS_MAP)

export function includesKeyWords(value: string): boolean {
    return BYPASS_KEY_WORDS.some((name: string): boolean => {
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
    if (!includesFullKeyWords(source)) {
        return source
    }
    const AST: ParseResult<t.File> = parse(source, {
        sourceType: "unambiguous"
    })
    ASTBypassAddImport(AST)
    return generate(AST).code
}

export function ASTBypassAddImport(AST: t.File): void {
    imports = {}
    traverse(AST, BypassAddImportVisitor)
    for (const [name, source] of Object.entries(imports)) {
        AST.program.body.unshift(t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(name))],
            t.stringLiteral(source)
        ))
    }
}

let imports: Record<string, string> = {}

const BypassAddImportVisitor: Visitor = {
    Identifier(identifierPath: NodePath<t.Identifier>): void {
        const { parentPath, node: identifier } = identifierPath
        if (
            parentPath.isImportSpecifier() ||
            parentPath.isExportSpecifier()
        ) {
            return
        }
        if (
            parentPath.isObjectProperty({ key: identifier }) ||
            parentPath.isObjectMethod({ key: identifier }) ||
            parentPath.isClassProperty({ key: identifier }) ||
            parentPath.isClassMethod({ key: identifier })
        ) {
            return
        }
        const { name: identifierName } = identifier
        if (identifierPath.scope.getBinding(identifierName) != undefined) {
            return
        }
        const bypass: Bypass | undefined = BYPASS_MAP[identifierName]
        if (bypass != null && bypass.importSource != null) {
            imports[identifierName] = bypass.importSource
        }
    }
}

export function bypassKeyWordsCheck(source: string): string {
    if (!includesFullKeyWords(source)) {
        return source
    }
    const AST: ParseResult<t.File> = parse(source, {
        sourceType: "unambiguous"
    })
    ASTBypassKeyWordsCheck(AST)
    return generate(AST).code
}

export function ASTBypassKeyWordsCheck(AST: t.File): void {
    traverse(AST, BypassKeyWordsCheckVisitor)
    for (const comment of AST.comments ?? []) {
        comment.value = replaceKeyWordsInString(comment.value)
    }
}

const BypassKeyWordsCheckVisitor: Visitor = {
    ImportSpecifier(path: NodePath<t.ImportSpecifier>): void {
        replaceInIdentifier(path.get("local"))
    },
    ExportSpecifier(path: NodePath<t.ExportSpecifier>): void {
        replaceInIdentifier(path.get("local"))
    },
    ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>): void {
        const { node } = path
        const declaration: NodePath<t.Declaration | null | undefined> = path.get("declaration")
        if (declaration.node != null) {
            path.insertBefore(declaration.node)
            node.declaration = null
            node.specifiers.push(...getDeclarationNames(declaration as NodePath<t.Declaration>).map(
                (name: string): t.ExportSpecifier => t.exportSpecifier(
                    t.identifier(name), t.identifier(name)
                )
            ))
        }
    },
    ObjectProperty: setPropertyKeyComputed,
    ObjectMethod: setPropertyKeyComputed,
    ClassProperty: setPropertyKeyComputed,
    ClassMethod: setPropertyKeyComputed,
    MemberExpression(memberExpressionPath: NodePath<t.MemberExpression>): void {
        const { node: memberExpression } = memberExpressionPath
        if (memberExpression.computed) {
            return
        }
        const { property } = memberExpression
        if (t.isIdentifier(property) && includesKeyWords(property.name)) {
            memberExpression.property = t.stringLiteral(property.name)
            memberExpression.computed = true
        } else if (t.isStringLiteral(property) && includesKeyWords(property.value)) {
            memberExpression.computed = true
        }
    },
    Identifier(identifierPath: NodePath<t.Identifier>): void {
        const { parentPath, node: identifier } = identifierPath
        if (
            parentPath.isImportSpecifier() ||
            parentPath.isExportSpecifier()
        ) {
            return
        }
        if (
            parentPath.isObjectProperty({ key: identifier }) ||
            parentPath.isObjectMethod({ key: identifier }) ||
            parentPath.isClassProperty({ key: identifier }) ||
            parentPath.isClassMethod({ key: identifier })
        ) {
            return
        }
        replaceInIdentifier(identifierPath)
    },
    StringLiteral(stringLiteralPath: NodePath<t.StringLiteral>): void {
        const { parentPath, node: stringLiteral } = stringLiteralPath
        if (
            parentPath.isImportDeclaration() ||
            parentPath.isExportDeclaration()
        ) {
            return
        }
        for (const [name, bypass] of Object.entries(BYPASS_MAP)) {
            if (bypass.replace == null) {
                continue
            }
            if (stringLiteral.value.includes(name)) {
                const strings: string[] = stringLiteral.value.split(name)
                stringLiteralPath.replaceWith(t.stringLiteral(strings.shift() ?? ""))
                while (strings.length > 0) {
                    stringLiteralPath.replaceWith(t.binaryExpression(
                        "+",
                        t.binaryExpression(
                            "+",
                            stringLiteralPath.node,
                            getStringReplaceExpression(bypass)
                        ),
                        t.stringLiteral(strings.shift() ?? "")
                    ))
                }
                return
            }
        }
    },
    TemplateLiteral(path: NodePath<t.TemplateLiteral>): void {
        const { node } = path
        for (const [name, bypass] of Object.entries(BYPASS_MAP)) {
            if (bypass.replace == null) {
                continue
            }
            for (let i: number = node.quasis.length - 1; i >= 0; i--) {
                const parts: string[] = node.quasis[i]!.value.raw.split(name)
                node.quasis.splice(i, 1, ...parts.map((part: string): t.TemplateElement => ({
                    type: "TemplateElement",
                    value: {
                        raw: part
                    },
                    tail: false
                })))
                for (let j: number = 1; j < parts.length; j++) {
                    node.expressions.splice(i, 0, getStringReplaceExpression(bypass))
                }
            }
        }
    }
}

function getDeclarationNames(declarationPath: NodePath<t.Declaration>): string[] {
    const { node: declaration } = declarationPath
    const result: string[] = []
    if (declarationPath.isVariableDeclaration()) {
        for(const declaratorPath of declarationPath.get("declarations")) {
            const idPath: NodePath<t.VoidPattern | t.LVal> = declaratorPath.get("id")
            if (idPath.isIdentifier()) {
                result.push(idPath.node.name)
            } else {
                declarationNames = []
                idPath.traverse(GetDeclarationNamesVisitor)
                result.push(...declarationNames)
            }
        }
    } else if (
        t.isFunctionDeclaration(declaration) ||
        t.isClassDeclaration(declaration)
    ) {
        if (t.isIdentifier(declaration.id)) {
            result.push(declaration.id.name)
        }
    }
    return result
}

const GetDeclarationNamesVisitor: Visitor = {
    Property(propertyPath: NodePath<t.Property>): void {
        propertyPath.get("value").skip()
    },
    AssignmentExpression(assignmentExpressionPath: NodePath<t.AssignmentExpression>): void {
        assignmentExpressionPath.get("right").skip()
    },
    Identifier(identifierPath: NodePath<t.Identifier>): void {
        const { parentPath: objectPath, node: identifier } = identifierPath
        if (objectPath.isObjectProperty({ key: identifier })) {
            return
        }
        declarationNames.push(identifier.name)
    }
}

let declarationNames: string[] = []

function setPropertyKeyComputed(propertyPath: NodePath<t.ObjectProperty | t.ObjectMethod | t.ClassMethod | t.ClassProperty>): void {
    const { node: property } = propertyPath
    if (property.computed) {
        return
    }
    const { key } = property
    if (t.isIdentifier(key) && includesKeyWords(key.name)) {
        property.key = t.stringLiteral(key.name)
        property.computed = true
    } else if (t.isStringLiteral(key) && includesKeyWords(key.value)) {
        property.computed = true
    }
}

function replaceInIdentifier(identifierPath: NodePath<t.Identifier>): void {
    const { node: identifier } = identifierPath
    identifier.name = replaceKeyWordsInString(identifier.name)
}

function getStringReplaceExpression(bypass: Bypass): t.Expression {
    return StringReplaceTemplate({ STRING: t.stringLiteral(bypass.replace ?? "") })
}

const StringReplaceTemplate: (arg?: template.PublicReplacements) => t.Expression = template.expression(`
    STRING.replace(/_/g, "")
`)

export function bypassRestrictions(source: string): string {
    if (!includesFullKeyWords(source)) {
        return source
    }
    const AST: ParseResult<t.File> = parse(source, {
        sourceType: "unambiguous"
    })
    ASTBypassAddImport(AST)
    ASTBypassKeyWordsCheck(AST)
    return generate(AST).code
}
