import type * as webpack from "webpack"
import * as t from "@babel/types"
import { parse } from "@babel/parser"
import generate from "@babel/generator"
import traverse, { NodePath, Visitor } from "@babel/traverse"

export default function ExternalImportLoader(
    this: webpack.LoaderContext<Record<string, string>>,
    content: string
): string {
    externals = this.getOptions()
    const AST: t.File = parse(content, { sourceType: "unambiguous" })
    traverse(AST, ExternalImportLoaderVisitor)
    return generate(AST).code
}

let externals: Record<string, string> = {}

const ExternalImportLoaderVisitor: Visitor = {
    CallExpression(callExpressionPath: NodePath<t.CallExpression>): void {
        const calleePath: NodePath<t.Node> = callExpressionPath.get("callee")
        const argumentPath: NodePath<t.Node> | undefined = callExpressionPath.get("arguments")[0]
        if (!calleePath.isImport()) {
            return
        }
        if (!argumentPath?.isStringLiteral()) {
            return
        }
        const { node: argument } = argumentPath
        if (!Object.prototype.hasOwnProperty.call(externals, argument.value)) {
            return
        }
        calleePath.replaceWith(t.identifier("__slightning_coco_widget_import__"))
        argumentPath.replaceWith(t.stringLiteral(externals[argument.value]!))
        hasExternal = true
    },
    Program: {
        enter(): void {
            hasExternal = false
        },
        exit({ node: program }: NodePath<t.Program>): void {
            if (hasExternal) {
                program.body.unshift(t.importDeclaration(
                    [t.importDefaultSpecifier(t.identifier("__slightning_coco_widget_import__"))],
                    t.stringLiteral(require.resolve("slightning-coco-widget--webpack/runtime/load-external-module"))
                ))
            }
        }
    }
}

let hasExternal: boolean = false
