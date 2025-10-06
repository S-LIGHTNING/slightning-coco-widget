import packageInfo from "../../../package.json"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { XMLEscape } from "../../utils"
import { RuntimeInstanceOfClassTypeProps, RuntimeInstanceOfClassType } from "../runtime/type/instance-of-class-type"
import { ChildTypeInfo, RuntimeTypeData, Type } from "./type"
import { typeGenerateRuntimeData } from "./utils"

export class InstanceOfClassType<T> extends RuntimeInstanceOfClassType<T> implements Type<T> {

    public readonly key: string = "InstanceOfClassType"
    public readonly defaultValue: string

    public constructor(theClass: new (...args: any[]) => T)
    public constructor(props: {
        defaultValue?: string | null | undefined
    } & RuntimeInstanceOfClassTypeProps<T> | (new (...args: any[]) => T))
    public constructor(props: {
        defaultValue?: string | null | undefined
    } & RuntimeInstanceOfClassTypeProps<T> | (new (...args: any[]) => T)) {
        if (typeof props == "function") {
            props = { theClass: props }
        }
        super(props)
        this.defaultValue = props.defaultValue ?? `实例<${props.theClass.name}>`
    }

    public toJSON(this: this): RuntimeTypeData {
        return typeGenerateRuntimeData(packageInfo.name, "RuntimeInstanceOfClassType", {
            theClass: {
                __slightning_coco_widget_expression__: this.theClass.name
            },
            defaultValue: this.defaultValue
        })
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return false
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }
}

export { InstanceOfClassType as InstanceType }
