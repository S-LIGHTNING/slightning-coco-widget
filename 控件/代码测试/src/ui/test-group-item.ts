import { Test } from "../test"
import { TestGroup } from "../test-group"
import { Component } from "./component"
import { TestItem } from "./test-item"
import { TestNodeItem } from "./test-node-item"

export class TestGroupItem extends TestNodeItem {

    public readonly group: TestGroup
    public readonly children: Component[]

    public readonly childrenElement: HTMLElement

    public constructor(group: TestGroup) {
        super(group)
        this.group = group
        this.element.classList.add(
            "slightning--code-test-widget--table--body--test-group-item"
        )
        this.childrenElement = document.createElement("div")
        this.childrenElement.classList.add("slightning--code-test-widget--table--body--test-group-item--children")
        this.element.appendChild(this.childrenElement)
        this.children = []
        for (const child of this.group.children) {
            this.addChild(child)
        }
        group.addedChild.on(this.addChild)
    }

    private addChild: (child: Test | TestGroup) => void = (child: Test | TestGroup): void => {
        let childItem: Component
        if ("children" in child) {
            this.children.push(childItem = new TestGroupItem(child))
        } else {
            this.children.push(childItem = new TestItem(child))
        }
        childItem.mount(this.childrenElement)
    }

    public override clean(this: this): void {
        for (const child of this.children) {
            child.clean()
        }
        this.group.addedChild.off(this.addChild)
        super.clean()
    }
}
