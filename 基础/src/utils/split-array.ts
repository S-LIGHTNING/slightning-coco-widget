export function splitArray<T>(array: T[], separator: T): T[][] {
    const result: T[][] = []
    let part: T[] = []
    for (const item of array) {
        if (item === separator) {
            result.push(part)
            part = []
            continue
        }
        part.push(item)
    }
    result.push(part)
    return result
}
