import { Signal } from "@soncodi/signal"
import { TestNode } from "../test-node"
import { Component } from "./component"

export class TestNodeItem extends Component {

    public readonly node: TestNode

    private readonly cells: TestNodeItemCell[]

    public constructor(node: TestNode) {
        super()
        this.node = node
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-node-item"
        )
        const dataRowElement: HTMLElement = document.createElement("div")
        dataRowElement.classList.add(
            "slightning--code-test-widget--table--row",
            "slightning--code-test-widget--table--body--row",
            "slightning--code-test-widget--table--body--test-node-item--data-row"
        )
        this.cells = []
        const nameCell: TestNodeItemCell = new TestNodeItemCell({
            getData: (): { value: string } => ({
                value: node.name
            }),
            signals: []
        })
        nameCell.mount(dataRowElement)
        this.cells.push(nameCell)
        const succeedCountCell: TestNodeItemCell = new TestNodeItemCell({
            getData: (): {
                value: number
                process: number
             } => ({
                value: node.getSucceedCount(),
                process: node.getSucceedCount() == 0 ? 0 : (node.getSucceedCount() / node.getTestCount())
            }),
            processColor: "#C6EFCE",
            signals: [node.succeedCountIncreased, node.testCountIncreased]
        })
        succeedCountCell.mount(dataRowElement)
        this.cells.push(succeedCountCell)
        const failedCountCell: TestNodeItemCell = new TestNodeItemCell({
            getData: (): {
                value: number
                process: number
             } => ({
                value: node.getFailedCount(),
                process: node.getFailedCount() == 0 ? 0 : node.getFailedCount() / node.getTestCount()
            }),
            processColor: "#FFC7CE",
            signals: [node.failedCountIncreased, node.testCountIncreased]
        })
        failedCountCell.mount(dataRowElement)
        this.cells.push(failedCountCell)
        const finishedCountCell: TestNodeItemCell = new TestNodeItemCell({
            getData: (): {
                value: number
                process: number
             } => ({
                value: node.getFinishedCount(),
                process: node.getFinishedCount() == 0 ? 0 : node.getFinishedCount() / node.getTestCount()
            }),
            processColor: "#88E2FE",
            signals: [node.finishedCountIncreased, node.testCountIncreased]
        })
        finishedCountCell.mount(dataRowElement)
        this.cells.push(finishedCountCell)
        const testCountCell: TestNodeItemCell = new TestNodeItemCell({
            getData: (): { value: number } => ({
                value: node.getTestCount()
            }),
            signals: [node.testCountIncreased]
        })
        testCountCell.mount(dataRowElement)
        this.cells.push(testCountCell)
        const skipCountCell: TestNodeItemCell = new TestNodeItemCell({
            getData: (): {
                value: number
                process: number
             } => ({
                value: node.getSkipCount(),
                process: node.getSkipCount() == 0 ? 0 : node.getSkipCount() / node.getTotalCount()
            }),
            processColor: "#FFEB9C",
            signals: [node.skipCountIncreased, node.totalCountIncreased]
        })
        skipCountCell.mount(dataRowElement)
        this.cells.push(skipCountCell)
        const totalCountCell: TestNodeItemCell = new TestNodeItemCell({
            getData: (): { value: number } => ({
                value: node.getTotalCount()
            }),
            signals: [node.totalCountIncreased]
        })
        totalCountCell.mount(dataRowElement)
        this.cells.push(totalCountCell)
        this.element.appendChild(dataRowElement)
    }

    public override clean(this: this): void {
        for (const cell of this.cells) {
            cell.clean()
        }
        super.clean()
    }
}

export class TestNodeItemCell extends Component {

    private readonly getData: () => {
        value: number | string
        process?: number
    }
    private readonly signals: Signal<unknown>[]

    private readonly valueElement: HTMLElement
    private readonly processElement: HTMLElement

    public constructor({
        getData, processColor, signals
    }: {
        getData(): {
            value: number | string
            process?: number
        }
        processColor?: string
        signals: Signal<unknown>[]
    }) {
        super()
        this.element.classList.add(
            "slightning--code-test-widget--table--cell",
            "slightning--code-test-widget--table--body--cell",
            "slightning--code-test-widget--table--body--test-node-item--data-cell"
        )

        this.processElement = document.createElement("div")
        this.processElement.classList.add(
            "slightning--code-test-widget--table--body--test-node-item--data-cell--process"
        )
        this.processElement.style.backgroundColor = processColor ?? ""
        this.element.appendChild(this.processElement)

        this.valueElement = document.createElement("div")
        this.valueElement.classList.add(
            "slightning--code-test-widget--table--body--test-node-item--data-cell--value"
        )
        this.element.appendChild(this.valueElement)

        this.getData = getData
        this.signals = signals
        this.updateElement()
        for (const signal of this.signals) {
            signal.on(this.updateElement)
        }
    }

    private updateElement: () => void = (): void => {
        const { value, process } = this.getData()
        if (process != null) {
            this.processElement.style.width = `${process * 100}%`
        }
        this.valueElement.innerText = value.toString()
    }

    public override clean(this: this): void {
        for (const signal of this.signals) {
            signal.off(this.updateElement)
        }
        super.clean()
    }
}
