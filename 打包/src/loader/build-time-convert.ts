import type * as webpack from "webpack"
import traverse, { NodePath } from "@babel/traverse"
import * as t from "@babel/types"
import crypto from "crypto"
import path from "path"

const platform = (process.env["__slightning_coco_widget_platform__"] ?? "All") as StandardPlatform | "All"

export function convert(AST: t.File, visitor?: {
    getSuperWidget?: ((path: NodePath<t.CallExpression>, context: string) => void) | null | undefined
    Logger?: ((path: NodePath<t.NewExpression>, context: string) => void) | null | undefined
    exportWidget?: ((path: NodePath<t.CallExpression>, context: string) => void) | null | undefined
    decorator?: ((node: t.Identifier, context: string, exportWidgetPath: NodePath<t.Expression>) => t.Expression | null) | null | undefined
} | null | undefined): boolean {
    getSCWImport(AST)
    const filepath = AST.extra?.["__slightning_coco_widget_filepath__"] as string | undefined
    const isSCWsFile = filepath?.includes("slightning-coco-widget")
    // const isSCWsFile = true
    if (
        !isSCWsFile &&
        importNamespaceNames.size == 0 &&
        Object.keys(namedImportNames).length == 0
    ) {
        return true
    }
    let recordCount: number = 0
    const platformsDecorator: Partial<Record<StandardPlatform, t.Expression[]>> = {}
    let currentPlatforms: StandardPlatform[] | null = null
    traverse(AST, {
        CallExpression(callExpressionPath): void {
            const calleePath = callExpressionPath.get("callee")
            const { node: callee } = calleePath
            if (isSCWsExpression(callee, "getSuperWidget")) {
                visitor?.getSuperWidget?.(callExpressionPath, `getSuperWidget_${recordCount++}`)
            } else if (isSCWsExpression(callee, "exportWidget")) {
                const configPath = callExpressionPath.get("arguments")[2]
                visitor?.exportWidget?.(callExpressionPath, `exportWidget_${recordCount++}`)
                configPath?.traverse({
                    ObjectProperty: {
                        enter({ node: objectProperty }): void {
                            if (objectProperty.computed) {
                                return
                            }
                            const { key } = objectProperty
                            if (t.isIdentifier(key)) {
                                const { name } = key
                                if (Object.prototype.hasOwnProperty.call(PLATFORM_MAP, name)) {
                                    currentPlatforms = PLATFORM_MAP[name as Platform]
                                }
                            } else if (t.isStringLiteral(key)) {
                                const { value } = key
                                if (Object.prototype.hasOwnProperty.call(PLATFORM_MAP, value)) {
                                    currentPlatforms = PLATFORM_MAP[value as Platform]
                                }
                            }
                        },
                        exit({ node: objectProperty }): void {
                            if (objectProperty.computed) {
                                return
                            }
                            const { key } = objectProperty
                            if (t.isIdentifier(key)) {
                                const { name } = key
                                if (Object.prototype.hasOwnProperty.call(PLATFORM_MAP, name)) {
                                    currentPlatforms = null
                                }
                            } else if (t.isStringLiteral(key)) {
                                const { value } = key
                                if (Object.prototype.hasOwnProperty.call(PLATFORM_MAP, value)) {
                                    currentPlatforms = null
                                }
                            }
                        }
                    },
                    Identifier(identifierPath): void {
                        const { parentPath, node: identifier } = identifierPath
                        if (
                            parentPath.isMemberExpression({ property: identifier, computed: false }) ||
                            parentPath.isObjectProperty({ key: identifier, computed: false }) ||
                            parentPath.isObjectMethod({ key: identifier, computed: false }) ||
                            parentPath.isClassProperty({ key: identifier, computed: false }) ||
                            parentPath.isClassMethod({ key: identifier, computed: false })
                        ) {
                            return
                        }
                        if (platform == "All") {
                            for (const platform of currentPlatforms ?? ["CoCo", "CreationProject1", "CreationProject2", "NodeJS"]) {
                                platformsDecorator[platform] ??= []
                                platformsDecorator[platform].push(identifier)
                            }
                        } else if (currentPlatforms == null || currentPlatforms.includes(platform)) {
                            platformsDecorator[platform] ??= []
                            platformsDecorator[platform]!.push(identifier)
                        }
                    }
                })
                const decoratorVisitor = visitor?.decorator
                configPath?.replaceWith(
                    t.objectExpression([t.objectProperty(t.identifier("decorators"),
                        t.arrayExpression([t.objectExpression(
                            Object.entries(platformsDecorator).map(
                                ([platform, nodes]): t.ObjectProperty => t.objectProperty(
                                    t.identifier(platform), t.arrayExpression(
                                        nodes.map((node): t.Expression | null =>
                                            decoratorVisitor == null ? null : decoratorVisitor(
                                                node as t.Identifier,
                                                `decorator_${platform}_${(node as t.Identifier).name}_${recordCount++}`,
                                                callExpressionPath
                                            )
                                        )
                                    )
                                )
                            )
                        )])
                    )])
                )
            } else if (isSCWsFile && platform != null && platform != "All") {
                if (calleePath.isIdentifier({ name: "crossPlatform" })) {
                    const allPlatforms = callExpressionPath.get("arguments")[0]
                    if (!allPlatforms?.isObjectExpression()) {
                        return
                    }
                    let platforms = null
                    const propertiesPath = allPlatforms.get("properties")
                    for (const propertyPath of propertiesPath) {
                        if (propertyPath.isObjectProperty() || propertyPath.isObjectMethod()) {
                            const { node: property } = propertyPath
                            if (t.isIdentifier(property.key, { name: platform })) {
                                platforms = property
                            }
                        }
                    }
                    if (t.isObjectProperty(platforms)) {
                        callExpressionPath.replaceWith(platforms.value)
                    } else if (t.isObjectMethod(platforms)) {
                        callExpressionPath.replaceWith(t.functionExpression(
                            null, platforms.params, platforms.body, platforms.generator, platforms.async
                        ))
                    } else {
                        callExpressionPath.remove()
                    }
                }
            }
        },
        NewExpression(newExpression): void {
            const calleePath = newExpression.get("callee")
            const { node: callee } = calleePath
            if (isSCWsExpression(callee, "Logger")) {
                visitor?.Logger?.(newExpression, `Logger_${recordCount++}`)
            }
        }
    })
    return false
}

let importNamespaceNames: Set<string>
let namedImportNames: Record<string, string>

function getSCWImport(AST: t.File): void {
    importNamespaceNames = new Set()
    namedImportNames = {}
    const { body: programBody } = AST.program
    for (const statement of programBody) {
        if (!t.isImportDeclaration(statement)) {
            continue
        }
        const importDeclaration = statement
        const { source: importSource } = importDeclaration
        if (!/^slightning-coco-widget\/?$/.test(importSource.value)) {
            continue
        }
        for (const importSpecifier of importDeclaration.specifiers) {
            if (t.isImportSpecifier(importSpecifier)) {
                const { imported, local } = importSpecifier
                let importedName: string
                if (t.isIdentifier(imported)) {
                    importedName = imported.name
                } else if (t.isStringLiteral(imported)) {
                    importedName = imported.value
                } else {
                    continue
                }
                namedImportNames[local.name] = importedName
            } else if (t.isImportNamespaceSpecifier(importSpecifier)) {
                importNamespaceNames.add(importSpecifier.local.name)
            }
        }
    }
}

function isSCWsExpression(expression: t.Node | string, name: string): expression is t.Expression {
    if (typeof expression != "string") {
        if (t.isMemberExpression(expression, { computed: false })) {
            const { object, property } = expression
            if (!t.isIdentifier(object)) {
                return false
            }
            if (!importNamespaceNames.has(object.name)) {
                return false
            }
            if (!t.isIdentifier(property)) {
                return false
            }
            return property.name == name
        } else if (t.isIdentifier(expression)) {
            ({ name: expression } = expression)
        } else {
            return false
        }
    }
    expression = namedImportNames[expression] ?? ""
    return expression == name
}

const PLATFORM_MAP: Record<Platform, StandardPlatform[]> = {
    CoCo: ["CoCo"],
    CreationProject: ["CreationProject1", "CreationProject2"],
    CreationProject1: ["CreationProject1"],
    CreationProject2: ["CreationProject2"],
    NodeJS: ["NodeJS"]
}

type StandardPlatform = "CoCo" | "CreationProject1" | "CreationProject2" | "NodeJS"
type Platform = "CoCo" | "CreationProject" | "CreationProject1" | "CreationProject2" | "NodeJS"

export function getRecordFilepath(webpackContext: webpack.LoaderContext<void>): string {
    const hash = crypto.createHash("md5")
    hash.update(webpackContext.resourcePath)
    const filenameHash: string = hash.digest("hex")
    return path.resolve(
        process.cwd(),
        "node_modules",
        ".slightning-coco-widget",
        "temp",
        "build-time-convert",
        "records",
        filenameHash + ".json"
    )
}
