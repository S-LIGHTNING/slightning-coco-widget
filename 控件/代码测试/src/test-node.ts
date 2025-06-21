import { Signal } from "@soncodi/signal"

export abstract class TestNode {

    public readonly name: string
    public readonly skip: boolean

    private succeedCount: number
    private failedCount: number
    private finishedCount: number
    private testCount: number
    private skipCount: number
    private totalCount: number

    public readonly succeedCountIncreased: Signal<number>
    public readonly failedCountIncreased: Signal<number>
    public readonly finishedCountIncreased: Signal<number>
    public readonly testCountIncreased: Signal<number>
    public readonly skipCountIncreased: Signal<number>
    public readonly totalCountIncreased: Signal<number>

    public constructor({
        name, skip
    }: {
        name: string
        skip: boolean | null | undefined
    }) {

        this.name = name
        this.skip = skip ?? false

        this.succeedCount = 0
        this.failedCount = 0
        this.finishedCount = 0
        this.testCount = 0
        this.skipCount = 0
        this.totalCount = 0

        this.succeedCountIncreased = new Signal()
        this.failedCountIncreased = new Signal()
        this.finishedCountIncreased = new Signal()
        this.testCountIncreased = new Signal()
        this.skipCountIncreased = new Signal()
        this.totalCountIncreased = new Signal()
    }

    public getSucceedCount(): number {
        return this.succeedCount
    }

    public increaseSucceedCount(value: number = 1): void {
        this.succeedCount += value
        this.succeedCountIncreased.emit(value)
    }

    public getFailedCount(): number {
        return this.failedCount
    }

    public increaseFailedCount(value: number = 1): void {
        this.failedCount += value
        this.failedCountIncreased.emit(value)
    }

    public getFinishedCount(): number {
        return this.finishedCount
    }

    public increaseFinishedCount(value: number = 1): void {
        this.finishedCount += value
        this.finishedCountIncreased.emit(value)
    }

    public getTestCount(): number {
        return this.testCount
    }

    public increaseTestCount(value: number = 1): void {
        this.testCount += value
        this.testCountIncreased.emit(value)
    }

    public getSkipCount(): number {
        return this.skipCount
    }

    public increaseSkipCount(value: number = 1): void {
        this.skipCount += value
        this.skipCountIncreased.emit(value)
    }

    public getTotalCount(): number {
        return this.totalCount
    }

    public increaseTotalCount(value: number = 1): void {
        this.totalCount += value
        this.totalCountIncreased.emit(value)
    }

    abstract run(): void | Promise<void>
}
