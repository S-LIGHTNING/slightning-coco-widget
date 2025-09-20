export function XMLEscape(text: string): string {
    return text
        .replace(/\n/g, "&#10;")
        .replace(/\u0020/gu, "&#32;")
        .replace(/"/g, "&#34;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&#60;")
        .replace(/>/g, "&#62;")
        .replace(/\u2002/gu, "&#8194;")
        .replace(/\u2003/gu, "&#8195;")
        .replace(/\u00A0/gu, "&#160;")
        .replace(/　/g, "&#12288;")
}
