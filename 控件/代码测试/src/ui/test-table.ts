import { Component } from "./component"
import { TestGroup } from "../test-group"
import { TestGroupItem } from "./test-group-item"

export class TestTable extends Component {

    public readonly rootGroup: TestGroup
    public readonly rootGroupItem: TestGroupItem

    public constructor(rootGroup: TestGroup) {
        super()
        this.rootGroup = rootGroup
        this.rootGroupItem = new TestGroupItem(rootGroup)
        this.element.classList.add("slightning--code-test-widget--table")
        const tableHeadElement: HTMLElement = document.createElement("div")
        tableHeadElement.classList.add("slightning--code-test-widget--table--head")
        const tableHeadRowElement: HTMLElement = document.createElement("div")
        tableHeadRowElement.classList.add(
            "slightning--code-test-widget--table--row",
            "slightning--code-test-widget--table--head--row"
        )
        for (const title of ["名称", "成功", "失败", "完成", "需测", "跳过", "总共"]) {
            const titleElement: HTMLElement = document.createElement("div")
            titleElement.classList.add(
                "slightning--code-test-widget--table--cell",
                "slightning--code-test-widget--table--head--cell"
            )
            titleElement.innerText = title
            tableHeadRowElement.appendChild(titleElement)
        }
        tableHeadElement.appendChild(tableHeadRowElement)
        const tableBodyElement: HTMLElement = document.createElement("div")
        tableBodyElement.classList.add("slightning--code-test-widget--table--body")
        this.rootGroupItem.mount(tableBodyElement)
        this.element.appendChild(tableHeadElement)
        this.element.appendChild(tableBodyElement)
    }

    public override clean(this: this): void {
        this.rootGroupItem.clean()
        super.clean()
    }
}
