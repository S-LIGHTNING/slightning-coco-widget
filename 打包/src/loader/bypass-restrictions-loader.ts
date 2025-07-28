import { bypassRestrictions } from "../bypass"

export = function BypassRestrictionsLoader(content: string): string {
    return bypassRestrictions(content)
}
