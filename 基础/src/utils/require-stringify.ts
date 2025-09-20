import * as stringify from "@slightning/anything-to-string"

import { setStringify } from "./better-to-string"

export function requireStringify(): void {
    setStringify(stringify)
}
