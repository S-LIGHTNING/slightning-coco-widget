import { ExceptEqualFailure, ExceptExecuteFailure, ExceptFailure, ExceptNotExecuteFailure, Test, UserRecordFailure } from "../test"
import { betterToString, HTMLEscape } from "../utils"
import { Component } from "./component"
import { TestNodeItem } from "./test-node-item"
import * as diff from "diff"

export class TestItem extends TestNodeItem {

    public readonly test: Test

    public readonly failuresElement: HTMLElement
    public readonly failures: Component[]

    public constructor(test: Test) {
        super(test)
        this.test = test
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-item-row"
        )
        this.failuresElement = document.createElement("div")
        this.failuresElement.classList.add(
            "slightning--code-test-widget--table--body--test-item-row--failures"
        )
        this.failures = []
        for (const failure of test.exceptFailures) {
            this.addFailure(failure)
        }
        this.test.exceptFailed.on(this.addFailure)
        this.element.appendChild(this.failuresElement)
    }

    private addFailure: (failure: ExceptFailure) => void =(failure: ExceptFailure): void => {
        let failureComponent: ExceptFailureComponent
        switch (failure.type) {
            case "ExceptEqualFailure":
                failureComponent = new ExceptEqualFailureComponent(failure)
                break
            case "ExceptExecuteFailure":
                failureComponent = new ExceptExecuteFailureComponent(failure)
                break
            case "ExceptNotExecuteFailure":
                failureComponent = new ExceptNotExecuteFailureComponent(failure)
                break
            case "UserRecordFailure":
                failureComponent = new UserRecordFailureComponent(failure)
                break
            default:
                throw new Error("Unknown failure type")
        }
        failureComponent.mount(this.failuresElement)
        this.failures.push(failureComponent)
    }

    public override clean(this: this): void {
        this.test.exceptFailed.off(this.addFailure)
        for (const failure of this.failures) {
            failure.clean()
        }
        super.clean()
    }
}

export class ExceptFailureComponent extends Component {

    public readonly failure: ExceptFailure

    public constructor(failure: ExceptFailure) {
        super()
        this.failure = failure
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-item-row--failures--except-failure"
        )
    }
}

export class ExceptEqualFailureComponent extends ExceptFailureComponent {

    public override readonly failure: ExceptEqualFailure

    public constructor(failure: ExceptEqualFailure) {
        super(failure)
        this.failure = failure
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-item-row--failures--except-equal-failure"
        )
        this.element.innerText = "期望相等失败："
        const diffElement: HTMLElement = document.createElement("div")
        diffElement.classList.add(
            "slightning--code-test-widget--table--body--test-item-row--failures--except-equal-failure--diff"
        )
        let { received, excepted } = failure
        if (typeof received != "string" || typeof excepted != "string") {
            received = betterToString(received)
            excepted = betterToString(excepted)
        }
        const diffResult: diff.Change[] = diff.diffLines(received as string, excepted as string)
        for (const change of diffResult) {
            if (change.added) {
                diffElement.append(...createDiffElements(
                    change.value,
                    " + ",
                    "slightning--code-test-widget--table--body--test-item-row--failures--except-equal-failure--diff--added"
                ))
            } else if (change.removed) {
                diffElement.append(...createDiffElements(
                    change.value,
                    " - ",
                    "slightning--code-test-widget--table--body--test-item-row--failures--except-equal-failure--diff--removed"
                ))
            } else {
                diffElement.append(...createDiffElements(change.value, "   "))
            }
        }
        this.element.appendChild(diffElement)
        this.element.appendChild(diffElement)
    }
}

export class ExceptExecuteFailureComponent extends ExceptFailureComponent {

    public override readonly failure: ExceptExecuteFailure

    public constructor(failure: ExceptExecuteFailure) {
        super(failure)
        this.failure = failure
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-item-row--failures--except-execute-failure"
        )
        this.element.innerText = `期望执行 ${betterToString(failure.data)} 失败`
    }
}

export class ExceptNotExecuteFailureComponent extends ExceptFailureComponent {

    public override readonly failure: ExceptNotExecuteFailure

    public constructor(failure: ExceptNotExecuteFailure) {
        super(failure)
        this.failure = failure
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-item-row--failures--except-not-execute-failure"
        )
        this.element.innerHTML = HTMLEscape(`期望不执行 ${betterToString(failure.data)} 失败`)
    }
}

export class UserRecordFailureComponent extends ExceptFailureComponent {

    public override readonly failure: UserRecordFailure

    public constructor(failure: UserRecordFailure) {
        super(failure)
        this.failure = failure
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-item-row--failures--user-record-failure"
        )
        this.element.innerText = `用户记录失败：${failure.reason}`
    }
}

function createDiffElements(
    value: string,
    prefix: string,
    ...classList: string[]
): HTMLElement[] {
    const result: HTMLElement[] = []
    for (const line of value.split("\n")) {
        if (line == "") {
            continue
        }
        const element: HTMLElement = document.createElement("div")
        for (const className of classList) {
            element.classList.add(className)
        }
        element.innerHTML = HTMLEscape(prefix + line)
        result.push(element)
    }
    return result
}
