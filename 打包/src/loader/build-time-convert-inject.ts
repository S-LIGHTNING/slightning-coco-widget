import type * as webpack from "webpack"
import { parse, parseExpression } from "@babel/parser"
import * as t from "@babel/types"
import generate from "@babel/generator"
import fs from "fs"
import { convert, getRecordFilepath } from "./build-time-convert"
import traverse, { Scope } from "@babel/traverse"

let AST: t.File

interface DecoratorOperation {
    __slightning_coco_widget_decorator_operation__: true
    runtime?: {
        func?: string | null | undefined
        data?: unknown | null | undefined
    } | null | undefined
    add?: {
        methods?: Record<string, DecoratorAddMethodConfig> | null | undefined
    } | null | undefined
}

interface DecoratorAddMethodConfig {
    overwrite?: boolean | null | undefined
    async?: boolean | null | undefined
    args: string[]
}

export default function buildTimeConvertInjectLoader(
    this: webpack.LoaderContext<void>,
    content: string
): string {
    AST = parse(content, { sourceType: "unambiguous" })
    AST.extra ??= {}
    AST.extra["__slightning_coco_widget_filepath__"] = this.resourcePath
    let runtimeData: Record<string, unknown> = {}
    try {
        runtimeData = JSON.parse(String(fs.readFileSync(getRecordFilepath(this))))
    } catch (error) {
        if (!(error instanceof Error && "code" in error && error.code == "ENOENT")) {
            throw error
        }
    }
    const addMethod: Record<string, DecoratorAddMethodConfig> = {}
    for (const data of Object.values(runtimeData)) {
        if (
            data == null || typeof data != "object" ||
            !("__slightning_coco_widget_decorator_operation__" in data) ||
            !data.__slightning_coco_widget_decorator_operation__
        ) {
            continue
        }
        const operation = data as DecoratorOperation
        Object.assign(addMethod, operation.add?.methods)
    }
    const widgetClassProperty = new Set<string>()
    const addImportRecord: Record<string, Record<string, string>> = {}
    function imported(scope: Scope, source: string, imported: string): t.Identifier {
        const imports = addImportRecord[source] ?? (addImportRecord[source] = {})
        const local = scope.generateUid(imported)
        imports[local] = imported
        return t.identifier(local)
    }
    function JSON2AST(json: unknown, scope: Scope): t.Expression {
        const AST = parseExpression(`(${JSON.stringify(json)})`)
        traverse(AST, {
            noScope: true,
            ObjectProperty(objectPropertyPath) {
                const { node: objectProperty } = objectPropertyPath
                if (objectProperty.computed) {
                    return
                }
                const keyPath = objectPropertyPath.get("key")
                const { node: key } = keyPath
                if (
                    t.isStringLiteral(key) &&
                    /^\$|_|[a-z]|[A-Z](\$|_|[0-9]|[a-z]|[A-Z])*$/.test(key.value)
                ) {
                    keyPath.replaceWith(t.identifier(key.value))
                }
            },
            ObjectExpression: {
                exit(objectExpressionPath) {
                    const { node: objectExpression } = objectExpressionPath
                    const isObject = findPropertyValueFromObjectExpression(objectExpression, "__slightning_coco_widget_object__")
                    const expression = findPropertyValueFromObjectExpression(objectExpression, "__slightning_coco_widget_expression__")
                    if (t.isBooleanLiteral(isObject, { value: true })) {
                        const func = findPropertyValueFromObjectExpression(objectExpression, "func")
                        const data = findPropertyValueFromObjectExpression(objectExpression, "data")
                        if (!t.isObjectExpression(func)) {
                            return
                        }
                        const funcSource = findPropertyValueFromObjectExpression(func, "source")
                        const funcName = findPropertyValueFromObjectExpression(func, "name")
                        if (!t.isStringLiteral(funcSource) || !t.isStringLiteral(funcName)) {
                            return
                        }
                        objectExpressionPath.replaceWith(t.newExpression(
                            imported(scope, funcSource.value, funcName.value),
                            t.isExpression(data) ? [data] : []
                        ))
                    } else if (t.isStringLiteral(expression)) {
                        objectExpressionPath.replaceWithSourceString(expression.value)
                    }
                }
            },
            ArrayExpression({ node: { elements } }) {
                for (let i = 0; i <= elements.length; i++) {
                    if (t.isNullLiteral(elements[i])) {
                        elements[i] = null
                    }
                }
            }
        })
        return AST
    }
    const skip = convert(AST, {
        getSuperWidget(path, context) {
            path.replaceWith(t.callExpression(
                imported(path.scope, "slightning-coco-widget", "runtimeGetSuperWidget"),
                [JSON2AST(runtimeData[context], path.scope)]
            ))
        },
        Logger(path, context) {
            path.replaceWith(t.newExpression(
                imported(path.scope, "slightning-coco-widget", "RuntimeLogger"),
                [JSON2AST(runtimeData[context], path.scope), ...path.node.arguments.slice(1)]
            ))
        },
        exportWidget(path, context) {
            const [typesPath, classPath] = path.get("arguments")
            if (typesPath?.isIdentifier()) {
                typesPath.scope.getBinding(typesPath.node.name)?.path.remove()
            }
            if (classPath?.isIdentifier()) {
                const widgetClassPath = classPath.scope.getBinding(classPath.node.name)?.path
                if (widgetClassPath?.isClass()) {
                    const { node: widgetClass } = widgetClassPath
                    for (const property of widgetClass.body.body) {
                        if (
                            t.isClassProperty(property) ||
                            t.isClassMethod(property) ||
                            t.isClassAccessorProperty(property)
                        ) {
                            const { key } = property
                            if (t.isIdentifier(key)) {
                                widgetClassProperty.add(key.name)
                            }
                        }
                    }
                    for (const [key, { overwrite, async, args }] of Object.entries(addMethod)) {
                        if (!(overwrite ?? true) && widgetClassProperty.has(key)) {
                            continue
                        }
                        const body = args.pop()
                        widgetClass.body.body.push(t.classProperty(
                            t.identifier(key),
                            parseExpression(`(${(async ?? false) ? "async " : ""}function(${args.join(",")}){${body}})`)
                        ))
                    }
                }
            }
            const exportRuntimeData = runtimeData[context] as any
            path.replaceWith(t.callExpression(
                imported(path.scope, "slightning-coco-widget", "runtimeExportWidget"),
                [JSON2AST(exportRuntimeData, path.scope), classPath?.node ?? t.nullLiteral(), path.node.arguments[2] ?? t.nullLiteral()]
            ))
        },
        decorator(node, context, exportWidgetPath) {
            const operation = runtimeData[context] as DecoratorOperation | null | undefined
            if (operation == null) {
                return null
            }
            const { runtime } = operation
            if (runtime == null) {
                return null
            }
            const { data, func } = runtime
            if (func == null) {
                return null
            }
            const { scope } = exportWidgetPath
            const importPath = scope.getBinding(node.name)?.path.parentPath
            if (!importPath?.isImportDeclaration()) {
                console.log(importPath?.type)
                return null
            }
            const runtimeDecoratorName = scope.generateUidIdentifier(func)
            importPath.node.specifiers.push(t.importSpecifier(
                runtimeDecoratorName, t.identifier(func)
            ))
            return t.callExpression(
                imported(scope, "slightning-coco-widget", "warpDecoratorWithRuntimeData"),
                [JSON2AST(data, scope), runtimeDecoratorName]
            )
        }
    })
    if (skip) {
        return content
    }
    for (const [source, specifiers] of Object.entries(addImportRecord)) {
        AST.program.body.push(t.importDeclaration(
            Object.entries(specifiers).map(([local, imported]) => t.importSpecifier(
                t.identifier(local), t.identifier(imported)
            )),
            t.stringLiteral(source)
        ))
    }
    return generate(AST).code
}

function findPropertyValueFromObjectExpression(objectExpression: t.ObjectExpression, key: string) {
    return objectExpression.properties.find((property): property is t.ObjectProperty =>
        t.isObjectProperty(property, { computed: false }) &&
        t.isIdentifier(property.key, { name: key })
    )?.value
}
