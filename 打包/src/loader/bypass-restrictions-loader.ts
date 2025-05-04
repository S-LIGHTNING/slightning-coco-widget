import { bypassRestrictions } from "../bypass/bypass"

export = function BypassRestrictionsLoader(source: string): string {
    return bypassRestrictions(source)
}
