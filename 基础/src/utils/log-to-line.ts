export function logToLine(message: string): string[] {
    let lineArray: string[] = message.split("\n")
    if (lineArray.length > 1) {
        lineArray[0] = `┼　${lineArray[0]}`
        for (let i: number = 1; i < lineArray.length; i++) {
            lineArray[i] = `│　${lineArray[i]}`
        }
    }
    return lineArray
}
