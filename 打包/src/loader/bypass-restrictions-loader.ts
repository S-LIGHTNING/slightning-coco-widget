import { bypassRestrictions } from "../bypass"

export = function BypassRestrictionsLoader(source: string): string {
    return bypassRestrictions(source)
}
