import * as CoCo from "../../../coco"
import * as CreationProject1 from "../../../creation-project-1"
import * as CreationProject2 from "../../../creation-project-2"
import { crossPlatform } from "../cross-platform"

export const eventKeyMap: Record<string, string> = {}

export function emit(this: {}, key: string, ...args: unknown[]): void {
    key = eventKeyMap[key] ?? key
    crossPlatform<{ prototype: { emit(this: {}, key: string, ...args: unknown[]): void } }>({
        CoCo: CoCo.InvisibleWidget,
        CreationProject1: CreationProject1.widgetClass,
        CreationProject2: CreationProject2.widgetClass,
        NodeJS: class { emit(): void {} }
    }).prototype.emit.call(this, key, ...args)
}
