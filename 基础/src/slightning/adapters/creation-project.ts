import * as CreationProject from "../../creation-project"
import { convertToCreationProject } from "../convert/to-creation-project"
import { PropertiesTypes, Types } from "../types"
import { Widget } from "../widget"
import { Adapter, LoggerAdapter } from "./adapter"
import { ExportConfig } from "../export"

export const CreationProjectAdapter: Adapter = {
    getSuperWidget(types: Types) {
        const propertiesSet: Set<string> = new Set()
        function addProperties(properties: PropertiesTypes): void {
            for (const property of properties) {
                if ("contents" in property) {
                    addProperties(property.contents)
                    continue
                }
                propertiesSet.add(property.key)
            }
        }
        addProperties(types.properties)
        return class extends CreationProject.widgetClass {
            public constructor() {
                super()
                return new Proxy(this, {
                    defineProperty(target: CreationProject.widgetClass, property: string | symbol, attributes: PropertyDescriptor): boolean {
                        if (typeof property == "string" && propertiesSet.has(property)) {
                            return Reflect.defineProperty(target.props, property, attributes)
                        }
                        return Reflect.defineProperty(target, property, attributes)
                    },
                    deleteProperty(target: CreationProject.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.deleteProperty(target.props, p)
                        }
                        return Reflect.deleteProperty(target, p)
                    },
                    get(target: CreationProject.widgetClass, p: string | symbol, receiver: any): any {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.get(target.props, p, receiver)
                        }
                        return Reflect.get(target, p, receiver)
                    },
                    getOwnPropertyDescriptor(target: CreationProject.widgetClass, p: string | symbol): TypedPropertyDescriptor<any> | undefined {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.getOwnPropertyDescriptor(target.props, p)
                        }
                        return Reflect.getOwnPropertyDescriptor(target, p)
                    },
                    has(target: CreationProject.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.has(target.props, p)
                        }
                        return Reflect.has(target, p)
                    },
                    ownKeys(target: CreationProject.widgetClass): (string | symbol)[] {
                        return Reflect.ownKeys(target).concat(Reflect.ownKeys(target.props))
                    },
                    set(target: CreationProject.widgetClass, p: string | symbol, newValue: any, receiver: any): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.set(target.props, p, newValue, receiver)
                        }
                        return Reflect.set(target, p, newValue, receiver)
                    }
                })
            }
        }
    },
    exportWidget(types: Types, widget: Widget, config?: ExportConfig | null | undefined): void {
        for (const decorator of config?.CreationProject?.decorators ?? []) {
            [types, widget] = decorator(types, widget)
        }
        CreationProject.exportWidget(...convertToCreationProject(types, widget))
    },
    Logger: class CreationProjectLogger implements LoggerAdapter {

        private readonly widget: any

        public constructor(__types: Types, widget: any) {
            this.widget = widget
        }

        public log(messages: string): void {
            CreationProject.widgetClass.prototype.widgetLog.call(this.widget, messages)
        }

        public info(messages: string): void {
            CreationProject.widgetClass.prototype.widgetLog.call(this.widget, `[信息] ${messages}`)
        }

        public warn(messages: string): void {
            CreationProject.widgetClass.prototype.widgetWarn.call(this.widget, messages)
        }

        public error(messages: string): void {
            CreationProject.widgetClass.prototype.widgetError.call(this.widget, messages)
        }
    },
    emit(this: any, key: string, ...args: unknown[]): void {
        CreationProject.widgetClass.prototype.emit.call(this, key, ...args)
    },
    utils: {
        inNative(): boolean {
            return CreationProject.widgetRequire("cp_utils")?.native ?? false
        },
        inEditor(): boolean {
            return !(CreationProject.widgetRequire("cp_utils")?.player ?? true)
        },
        getImageURLByFileName(fileName: string): string | null {
            return CreationProject.widgetRequire("cp_utils")?.resToUrl.img(fileName) ?? null
        },
        getAudioURLByFileName(fileName: string): string | null {
            return CreationProject.widgetRequire("cp_utils")?.resToUrl.audio(fileName) ?? null
        },
        getVideoURLByFileName(fileName: string): string | null {
            return CreationProject.widgetRequire("cp_utils")?.resToUrl.video(fileName) ?? null
        }
    }
}
