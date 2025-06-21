import { Signal } from "@soncodi/signal"
import { TestNode } from "./test-node"
import _ from "lodash"

export interface BasicExceptFailure {
    type: string
}

export interface ExceptEqualFailure extends BasicExceptFailure {
    type: "ExceptEqualFailure"
    received: unknown
    excepted: unknown
}

export interface ExceptExecuteFailure extends BasicExceptFailure {
    type: "ExceptExecuteFailure"
    data: unknown
}

export interface ExceptNotExecuteFailure extends BasicExceptFailure {
    type: "ExceptNotExecuteFailure"
    data: unknown
}

export interface UserRecordFailure extends BasicExceptFailure {
    type: "UserRecordFailure"
    reason: string
}

export type ExceptFailure = ExceptEqualFailure | ExceptExecuteFailure | ExceptNotExecuteFailure | UserRecordFailure

export class Test extends TestNode {

    public readonly func: (this: Test) => void | Promise<void>

    public readonly exceptFailures: ExceptFailure[]

    public readonly exceptFailed: Signal<ExceptFailure>
    public readonly exceptEqualFailed: Signal<ExceptEqualFailure>
    public readonly exceptExecuteFailed: Signal<ExceptExecuteFailure>
    public readonly exceptNotExecuteFailed: Signal<ExceptNotExecuteFailure>
    public readonly userRecordFailed: Signal<UserRecordFailure>

    private readonly executions: unknown[]

    public constructor({
        name, skip, func
    }: {
        name: string
        skip: boolean,
        func: () => void | Promise<void>
    }) {
        super({ name, skip })
        this.increaseTotalCount()
        if (this.skip) {
            this.increaseSkipCount()
        } else {
            this.increaseTestCount()
        }
        this.func = func
        this.exceptFailures = []
        this.exceptFailed = new Signal()
        this.exceptEqualFailed = new Signal()
        this.exceptExecuteFailed = new Signal()
        this.exceptNotExecuteFailed = new Signal()
        this.userRecordFailed = new Signal()
        this.executions = []
    }

    public override run(): void | Promise<void> {
        if (this.skip) {
            return
        }
        const result: void | Promise<void> = this.func.call(this)
        if (result == undefined) {
            if (this.getFailedCount() == 0) {
                this.increaseSucceedCount()
            }
            this.increaseFinishedCount()
        } else {
            return result.then((): void => {
                if (this.getFailedCount() == 0) {
                    this.increaseSucceedCount()
                }
                this.increaseFinishedCount()
            })
        }
    }

    private failed(failure: ExceptFailure): void {
        if (this.getFailedCount() == 0) {
            this.increaseFailedCount()
        }
        this.exceptFailures.push(failure)
        this.exceptFailed.emit(failure)
    }

    public exceptEqual(received: unknown, excepted: unknown): void {
        if (!_.isEqual(received, excepted)) {
            const failure: ExceptEqualFailure = {
                type: "ExceptEqualFailure",
                received,
                excepted
            }
            this.failed(failure)
            this.exceptEqualFailed.emit(failure)
        }
    }

    public exceptExecute(data: unknown): void {
        if (!this.executions.some(
            (execution: unknown): boolean => _.isEqual(execution, data)
        )) {
            const failure: ExceptExecuteFailure = {
                type: "ExceptExecuteFailure",
                data
            }
            this.failed(failure)
            this.exceptExecuteFailed.emit(failure)
        }
    }

    public exceptNotExecute(data: unknown): void {
        if (this.executions.some(
            (execution: unknown): boolean => _.isEqual(execution, data)
        )) {
            const failure: ExceptNotExecuteFailure = {
                type: "ExceptNotExecuteFailure",
                data
            }
            this.failed(failure)
            this.exceptNotExecuteFailed.emit(failure)
        }
    }

    public recordFailure(this: this, reason: string): void {
        const failure: UserRecordFailure = {
            type: "UserRecordFailure",
            reason
        }
        this.failed(failure)
        this.userRecordFailed.emit(failure)
    }

    public recordExecute(this: this, data: unknown): void {
        this.executions.push(data)
    }
}
