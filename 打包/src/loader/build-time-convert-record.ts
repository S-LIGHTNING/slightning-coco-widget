import type * as webpack from "webpack"
import { parse } from "@babel/parser"
import { NodePath } from "@babel/traverse"
import * as t from "@babel/types"
import generate from "@babel/generator"

import { convert, getRecordFilepath } from "./build-time-convert"

let AST: t.File

export default function buildTimeConvertRecordLoader(
    this: webpack.LoaderContext<void>,
    content: string
): string {
    AST = parse(content, { sourceType: "unambiguous" })
    AST.extra ??= {}
    AST.extra["__slightning_coco_widget_filepath__"] = this.resourcePath
    const skip = convert(AST, {
        getSuperWidget(path, context): void {
            warpWithRecordContext(path.get("callee") as NodePath<t.Expression>, context)
        },
        Logger(path, context): void {
            warpWithRecordContext(path.get("callee") as NodePath<t.Expression>, context)
        },
        exportWidget(path, context): void {
            warpWithRecordContext(path.get("callee") as NodePath<t.Expression>, context)
        },
        decorator(node, context): t.Expression {
            return toWrappedWithRecordContext(node, context)
        }
    })
    if (skip) {
        return content
    }
    AST.program.body.push(t.expressionStatement(
        t.callExpression(
            t.identifier("__slightning_coco_widget_write_record__"),
            [t.stringLiteral(getRecordFilepath(this))]
        )
    ))
    return generate(AST).code
}

function warpWithRecordContext(path: NodePath<t.Expression>, context: string): void {
    path.replaceWith(toWrappedWithRecordContext(path.node, context))
    path.skip()
}

function toWrappedWithRecordContext(expression: t.Expression, context: string): t.Expression {
    return t.callExpression(
        t.identifier("__slightning_coco_widget_with_record_context__"),
        [t.stringLiteral(context), expression]
    )
}
