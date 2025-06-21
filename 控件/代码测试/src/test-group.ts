import { Signal } from "@soncodi/signal"
import { Test } from "./test"
import { TestNode } from "./test-node"

export class TestGroup extends TestNode {

    public readonly upper: TestGroup | null

    public readonly children: (Test | TestGroup)[]

    public readonly addedChild: Signal<Test | TestGroup>

    public constructor({
        name, skip, upper = null
    }: {
        name: string,
        skip?: boolean | null | undefined,
        upper?: TestGroup | null | undefined
    }) {
        super({ name, skip })
        this.upper  = upper
        this.children = []
        this.addedChild = new Signal()
        upper?.addChild(this)
    }

    public override run(): void | Promise<void> {
        return Promise.all(this.children.map((child: TestNode): Promise<void> => {
            return Promise.resolve(child.run())
        })).then()
    }

    public addChild(child: Test | TestGroup): void {
        this.children.push(child)
        this.increaseSucceedCount(child.getSucceedCount())
        this.increaseFailedCount(child.getFailedCount())
        this.increaseFinishedCount(child.getFinishedCount())
        this.increaseTestCount(child.getTestCount())
        this.increaseSkipCount(child.getSkipCount())
        this.increaseTotalCount(child.getTotalCount())
        child.succeedCountIncreased.on((value: number): void =>{
            this.increaseSucceedCount(value)
        })
        child.failedCountIncreased.on((value: number): void =>{
            this.increaseFailedCount(value)
        })
        child.finishedCountIncreased.on((value: number): void =>{
            this.increaseFinishedCount(value)
        })
        child.testCountIncreased.on((value: number): void =>{
            this.increaseTestCount(value)
        })
        child.skipCountIncreased.on((value: number): void =>{
            this.increaseSkipCount(value)
        })
        child.totalCountIncreased.on((value: number): void =>{
            this.increaseTotalCount(value)
        })
        this.addedChild.emit(child)
    }
}
