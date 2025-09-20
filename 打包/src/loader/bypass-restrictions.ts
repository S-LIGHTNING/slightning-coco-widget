import { bypassRestrictions } from "../bypass"

export default function BypassRestrictionsLoader(content: string): string {
    return bypassRestrictions(content)
}
