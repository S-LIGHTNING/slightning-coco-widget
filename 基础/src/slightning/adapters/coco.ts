import * as CoCo from "../../coco"
import { convertToCoCo } from "../convert/to-coco"
import { PropertiesTypes, Types } from "../types"
import { Widget } from "../widget"
import { Adapter, LoggerAdapter } from "./adapter"
import { ExportConfig } from "../export"

export const CoCoAdapter: Adapter = {
    getSuperWidget(types: Types) {
        return class extends (types.options.visible ? CoCo.VisibleWidget : CoCo.InvisibleWidget) {
            public constructor(props: Record<string, any>) {
                super(props)
                for (const [key, value] of Object.entries(props)) {
                    Object.defineProperty(this, key, {
                        value,
                        enumerable: true,
                        configurable: true
                    })
                }
                if (types.options.visible) {
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
                    return new Proxy(this as unknown as CoCo.VisibleWidget, {
                        set(target: CoCo.VisibleWidget, p: string | symbol, newValue: any, receiver: any): boolean {
                            if (typeof p == "string" && propertiesSet.has(p)) {
                                CoCo.VisibleWidget.prototype.setProps.call(target, {
                                    [p]: newValue
                                })
                                return true
                            }
                            return Reflect.set(target, p, newValue, receiver)
                        },
                    })
                }
            }
        }
    },
    exportWidget(types: Types, widget: Widget, config?: ExportConfig | null | undefined): void {
        for (const decorator of config?.CoCo?.decorators ?? []) {
            [types, widget] = decorator(types, widget)
        }
        CoCo.exportWidget(...convertToCoCo(types, widget))
    },
    Logger: class CoCoLogger implements LoggerAdapter {

        private readonly super: {
            prototype: CoCo.Widget
        }
        private readonly widget: any

        public constructor(types: Types, widget: any) {
            this.widget = widget
            this.super = types.options.visible ? CoCo.VisibleWidget : CoCo.InvisibleWidget
        }

        public log(messages: string): void {
            this.super.prototype.widgetLog.call(this.widget, messages)
        }

        public info(messages: string): void {
            this.super.prototype.widgetLog.call(this.widget, `[信息] ${messages}`)
        }

        public warn(messages: string): void {
            this.super.prototype.widgetWarn.call(this.widget, messages)
        }

        public error(messages: string): void {
            this.super.prototype.widgetError.call(this.widget, messages)
        }
    },
    emit(this: any, key: string, ...args: unknown[]): void {
        CoCo.InvisibleWidget.prototype.emit.call(this, key, ...args)
    },
    utils: {
        inNative(): boolean {
            return location.href == "file:///android_asset/www/index.html"
        },
        inEditor(): boolean {
            return /^https?:\/\/coco\.codemao\.cn\/editor\/(editor-player.html)?((#|\?).*)?$/.test(location.href)
        },
        getImageURLByFileName(fileName: string): string | null {
            return CoCo.widgetRequire("utils")?.getWidgetImageUrl(fileName) ?? null
        },
        getAudioURLByFileName(): string | null {
            return null
        },
        getVideoURLByFileName(): string | null {
            return null
        }
    }
}
