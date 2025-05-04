import { getDefaultAdapter } from "./adapters/adapter"
import { Types } from "./types"

export type Widget = new (props: any) => {}

export function getSuperWidget(types: Types): Widget {
    return getDefaultAdapter().getSuperWidget(types)
}
