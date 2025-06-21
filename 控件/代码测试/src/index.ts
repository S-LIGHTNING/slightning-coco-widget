import { addCheck, addThisForMethods, AnyType, Color, emit, exportWidget, flattenEventSubTypes, FunctionType, getSuperWidget, InstanceType, MethodBlockParam, ObjectType, StringEnumType, StringType, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types, Utils, VoidType } from "slightning-coco-widget"
import { TestGroup } from "./test-group"
import { Test } from "./test"
import { TestWindow } from "./ui/test-window"

class TestItemReference {
    public constructor(public readonly name: string) {}
}

class TestGroupReference extends TestItemReference {
    public constructor(testGroup: TestGroup) {
        super(testGroup.name)
    }
}

class TestReference extends TestItemReference {
    public constructor(test: Test) {
        super(test.name)
    }
}

const NameParam = {
    key: "name",
    label: "名称",
    type: new StringType("名称")
}
const TestTypeParam = {
    key: "type",
    label: "类型",
    type: new StringEnumType([
        ["测试", "test"],
        ["跳过", "skip"]
    ])
}
const TestGroupParam = {
    key: "group",
    label: "组",
    type: new InstanceType({
        theClass: TestGroupReference,
        defaultValue: "组"
    })
}
const TestParam = {
    key: "test",
    label: "测试",
    type: new InstanceType({
        theClass: TestReference,
        defaultValue: "测试"
    })
}
const ReceivedParam = {
    key: "received",
    label: "接收到的",
    type: new AnyType("接收到的")
}
const ExceptedParam = {
    key: "excepted",
    label: "期望的",
    type: new AnyType("期望的")
}

const types: Types = {
    type: "SLIGHTNING_CODE_TEST_WIDGET",
    info: {
        title: "代码测试",
        icon: "https://creation.bcmcdn.com/716/appcraft/IMAGE_25TZKwykP_1746069500083.svg",
        category: "测试",
    },
    options: {
        visible: false,
        global: true
    },
    properties: [],
    methods: [{ blockOptions: {
        icon: "https://creation.bcmcdn.com/716/appcraft/IMAGE_ds9eQxkRo_1746070657312.svg",
        color: Color.CYAN
    }, contents: [
        {
            label: "控制",
            contents: [
                {
                    key: "startTest",
                    label: "开始测试",
                    block: [MethodBlockParam.METHOD]
                }, {
                    key: "showTest",
                    label: "显示测试",
                    block: [MethodBlockParam.METHOD]
                }, {
                    key: "hideTest",
                    label: "隐藏测试",
                    block: [MethodBlockParam.METHOD]
                }
            ]
        }, {
            label: "组",
            contents: [
                {
                    key: "getRootGroup",
                    label: "根组",
                    block: [MethodBlockParam.METHOD],
                    returns: new ObjectType()
                }, {
                    key: "testSubGroup",
                    label: "测试子组",
                    block: [TestGroupParam, TestTypeParam, "子组", NameParam],
                    returns: new ObjectType()
                }
            ]
        }, {
            label: "测试",
            contents: [
                {
                    key: "test",
                    label: "测试",
                    block: [
                        TestGroupParam, TestTypeParam, NameParam, {
                            key: "callback",
                            label: "回调",
                            type: new FunctionType({
                                block: [TestParam],
                                returns: new VoidType()
                            })
                        }
                    ]
                }
            ]
        }, {
            label: "期望",
            contents: [
                {
                    key: "exceptEqual",
                    label: "期望相等",
                    block: [
                        TestParam, "期望", ReceivedParam, "等于", ExceptedParam
                    ]
                }, {
                    key: "exceptExecute",
                    label: "期望执行",
                    block: [
                        TestParam, "期望", "执行", {
                            key: "data",
                            label: "数据",
                            type: new AnyType("数据")
                        }
                    ]
                }, {
                    key: "exceptNotExecute",
                    label: "期望不执行",
                    block: [
                        TestParam, "期望", "不执行", {
                            key: "data",
                            label: "数据",
                            type: new AnyType("数据")
                        }
                    ]
                }
            ]
        }, {
            label: "记录",
            contents: [
                {
                    key: "recordFailure",
                    label: "记录失败",
                    block: [
                        TestParam, "记录", "失败", {
                            key: "reason",
                            label: "原因",
                            type: new AnyType("原因")
                        }
                    ]
                }, {
                    key: "recordExecute",
                    label: "记录执行",
                    block: [
                        TestParam, "记录", "执行", {
                            key: "data",
                            label: "数据",
                            type: new AnyType("数据")
                        }
                    ]
                }
            ]
        }
    ]}],
    events: [
        {
            key: "onTest",
            label: "测试",
            subTypes: [
                {
                    key: "state",
                    dropdown: [
                        ["全部完成", "AllFinished"],
                        ["全部成功", "AllSucceed"],
                        ["存在失败", "HasFailed"]
                    ]
                }
            ],
            params: []
        }
    ]
}

declare global {
    interface Window {
        __slightning_code_test_widget__: {
            showTest(rootGroup: TestGroup, testWindow: TestWindow | null): TestWindow
            hideTest(testWindow: TestWindow): void
        }
    }
}

Object.defineProperty(window, "__slightning_code_test_widget__", {
    value: {
        showTest(rootGroup: TestGroup, testWindow: TestWindow | null): TestWindow {
            testWindow ??= new class extends TestWindow {
                public constructor(rootGroup: TestGroup) {
                    super(rootGroup)
                    Utils.editor.getRunButton()?.addEventListener("click", this.onUnload)
                }
                public onUnload: () => void = (): void => {
                    this.destroy()
                }
                public override clean(this: this): void {
                    Utils.editor.getRunButton()?.removeEventListener("click", this.onUnload)
                    super.clean()
                }
            }(rootGroup)
            testWindow.mount(document.body)
            return testWindow
        },
        hideTest(testWindow: TestWindow): void {
            testWindow.destroy()
        }
    },
    enumerable: false,
    writable: true,
    configurable: true
})

class TestTypesWidget extends getSuperWidget(types) {

    private rootGroup: TestGroup
    private rootGroupReference: TestGroupReference
    private window: TestWindow | null = null

    private testGroupMap: WeakMap<TestGroupReference, TestGroup>
    private testMap: WeakMap<TestReference, Test>

    public constructor(props: unknown) {
        super(props)
        this.testGroupMap = new WeakMap()
        this.testMap = new WeakMap()
        this.rootGroup = new TestGroup({ name: "根" })
        this.rootGroupReference = this.newTestGroupReference(this.rootGroup)
    }

    public startTest(this: this): void {
        this.rootGroup.failedCountIncreased.once((): void => {
            emit.call(this, "onTestHasFailed")
        })
        this.rootGroup.finishedCountIncreased.on((): void => {
            if (this.rootGroup.getFinishedCount() == this.rootGroup.getTestCount()) {
                if (this.rootGroup.getFailedCount() == 0) {
                    emit.call(this, "onTestAllSucceed")
                }
                emit.call(this, "onTestAllFinished")
            }
        })
        this.rootGroup.run()
    }

    public showTest(this: this): void {
        this.window = (Utils.editor.getWindow() ?? window).__slightning_code_test_widget__.showTest(this.rootGroup, this.window)
    }

    public hideTest(this: this): void {
        if (this.window == null) {
            return
        }
        (Utils.editor.getWindow() ?? window).__slightning_code_test_widget__.hideTest(this.window)
    }

    public getRootGroup(this: this): TestGroupReference {
        return this.rootGroupReference
    }

    public testSubGroup(
        upperReference: TestGroupReference,
        type: "test" | "skip", name: string
    ): TestGroupReference {
        const upper: TestGroup = this.getTestGroupByReference(upperReference)
        return this.newTestGroupReference(new TestGroup({
            name,
            skip: upper.skip ? true : type == "skip",
            upper: upper
        }))
    }

    public test(
        groupReference: TestGroupReference,
        type: "test" | "skip", name: string,
        callback: (test: TestReference) => void | Promise<void>
    ): void {
        const group: TestGroup = this.getTestGroupByReference(groupReference)
        const test = new Test({
            name,
            skip: group.skip ? true : type == "skip",
            func: function (this: Test): void | Promise<void> {
                return callback(testReference)
            }
        })
        const testReference = this.newTestReference(test)
        group.addChild(test)
    }

    public exceptEqual(test: TestReference, received: unknown, excepted: unknown): void {
        this.getTestByReference(test).exceptEqual(received, excepted)
    }

    public exceptExecute(test: TestReference, data: unknown): void {
        this.getTestByReference(test).exceptExecute(data)
    }

    public exceptNotExecute(test: TestReference, data: unknown): void {
        this.getTestByReference(test).exceptNotExecute(data)
    }

    public recordFailure(test: TestReference, reason: string): void {
        this.getTestByReference(test).recordFailure(reason)
    }

    public recordExecute(test: TestReference, data: unknown): void {
        this.getTestByReference(test).recordExecute(data)
    }

    public newTestGroupReference(this: this, testGroup: TestGroup): TestGroupReference {
        const reference: TestGroupReference = new TestGroupReference(testGroup)
        this.testGroupMap.set(reference, testGroup)
        return reference
    }

    public newTestReference(this: this, test: Test): TestReference {
        const reference: TestReference = new TestReference(test)
        this.testMap.set(reference, test)
        return reference
    }

    public getTestGroupByReference(this: this, reference: TestGroupReference): TestGroup {
        const testGroup: TestGroup | undefined = this.testGroupMap.get(reference)
        if (testGroup == undefined) {
            throw new Error(`测试组 ${reference.name} 不存在`)
        }
        return testGroup
    }

    public getTestByReference(this: this, reference: TestGroupReference): Test {
        const test: Test | undefined = this.testMap.get(reference)
        if (test == undefined) {
            throw new Error(`测试 ${reference.name} 不存在`)
        }
        return test
    }
}

exportWidget(types, TestTypesWidget, {
    decorators: [
        { CreationProject: flattenEventSubTypes },
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        },
        addThisForMethods,
        addCheck
    ]
})
