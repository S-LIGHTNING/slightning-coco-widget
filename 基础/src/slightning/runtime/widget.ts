import { crossPlatform } from "./cross-platform"
import { Widget } from "../widget"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"

export interface RuntimeGetSuperWidgetData {
    isVisibleWidget: boolean
    propertiesName: string[]
}

export function runtimeGetSuperWidget(
    { isVisibleWidget, propertiesName }: RuntimeGetSuperWidgetData
): Widget {
    const propertiesSet = new Set(propertiesName)
    return crossPlatform({
        CoCo: (): Widget => class extends (isVisibleWidget ? CoCo.VisibleWidget : CoCo.InvisibleWidget) {
            public constructor(props: Record<string, any>) {
                super(props)
                if (isVisibleWidget) {
                    let isSettingProperty: boolean = false
                    return new Proxy(this as unknown as CoCo.VisibleWidget, {
                        set(target: CoCo.VisibleWidget, p: string | symbol, newValue: any, receiver: any): boolean {
                            if (!isSettingProperty && typeof p == "string" && propertiesSet.has(p)) {
                                isSettingProperty = true
                                CoCo.VisibleWidget.prototype.setProps.call(target, {
                                    [p]: newValue
                                })
                                isSettingProperty = false
                                return true
                            }
                            return Reflect.set(target, p, newValue, receiver)
                        }
                    })
                }
            }
        },
        CreationProject1: (): Widget => class extends CreationProject1.widgetClass {
            public constructor() {
                super()
                return new Proxy(this, {
                    defineProperty(target: CreationProject1.widgetClass, property: string | symbol, attributes: PropertyDescriptor): boolean {
                        if (typeof property == "string" && propertiesSet.has(property)) {
                            return Reflect.defineProperty(target.props, property, attributes)
                        }
                        return Reflect.defineProperty(target, property, attributes)
                    },
                    deleteProperty(target: CreationProject1.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.deleteProperty(target.props, p)
                        }
                        return Reflect.deleteProperty(target, p)
                    },
                    get(target: CreationProject1.widgetClass, p: string | symbol, receiver: any): any {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.get(target.props, p, receiver)
                        }
                        return Reflect.get(target, p, receiver)
                    },
                    getOwnPropertyDescriptor(target: CreationProject1.widgetClass, p: string | symbol): TypedPropertyDescriptor<any> | undefined {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.getOwnPropertyDescriptor(target.props, p)
                        }
                        return Reflect.getOwnPropertyDescriptor(target, p)
                    },
                    has(target: CreationProject1.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.has(target.props, p)
                        }
                        return Reflect.has(target, p)
                    },
                    ownKeys(target: CreationProject1.widgetClass): (string | symbol)[] {
                        return Reflect.ownKeys(target).concat(Reflect.ownKeys(target.props))
                    },
                    set(target: CreationProject1.widgetClass, p: string | symbol, newValue: any, receiver: any): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            if (isVisibleWidget) {
                                CreationProject1.widgetClass.prototype.setProp.call(receiver, p, newValue)
                                return true
                            } else {
                                return Reflect.set(target.props, p, newValue, receiver)
                            }
                        }
                        return Reflect.set(target, p, newValue, receiver)
                    }
                })
            }
        },
        CreationProject2: (): Widget =>  class extends CreationProject2.widgetClass {
            public constructor() {
                super()
                return new Proxy(this, {
                    defineProperty(target: CreationProject2.widgetClass, property: string | symbol, attributes: PropertyDescriptor): boolean {
                        if (typeof property == "string" && propertiesSet.has(property)) {
                            if (target.props == null) {
                                return true
                            }
                            return Reflect.defineProperty(target.props, property, attributes)
                        }
                        return Reflect.defineProperty(target, property, attributes)
                    },
                    deleteProperty(target: CreationProject2.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.deleteProperty(target.props, p)
                        }
                        return Reflect.deleteProperty(target, p)
                    },
                    get(target: CreationProject2.widgetClass, p: string | symbol, receiver: any): any {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.get(target.props, p, receiver)
                        }
                        return Reflect.get(target, p, receiver)
                    },
                    getOwnPropertyDescriptor(target: CreationProject2.widgetClass, p: string | symbol): TypedPropertyDescriptor<any> | undefined {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.getOwnPropertyDescriptor(target.props, p)
                        }
                        return Reflect.getOwnPropertyDescriptor(target, p)
                    },
                    has(target: CreationProject2.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.has(target.props, p)
                        }
                        return Reflect.has(target, p)
                    },
                    ownKeys(target: CreationProject2.widgetClass): (string | symbol)[] {
                        return Reflect.ownKeys(target).concat(Reflect.ownKeys(target.props))
                    },
                    set(target: CreationProject2.widgetClass, p: string | symbol, newValue: any, receiver: any): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            if (isVisibleWidget) {
                                CreationProject2.widgetClass.prototype.setProp.call(receiver, p, newValue)
                                return true
                            } else {
                                return Reflect.set(target.props, p, newValue, receiver)
                            }
                        }
                        return Reflect.set(target, p, newValue, receiver)
                    }
                })
            }
        },
        NodeJS: (): Widget =>  class {}
    })()
}
