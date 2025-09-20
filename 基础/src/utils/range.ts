export class Range {

    public constructor(
        public left: number | [number],
        public right: number | [number]
    ) {}

    public includes(value: number): boolean {
        if (Array.isArray(this.left)) {
            if (value < this.left[0]) {
                return false
            }
        } else if (value <= this.left) {
            return false
        }
        if (Array.isArray(this.right)) {
            if (value > this.right[0]) {
                return false
            }
        } else if (value >= this.right) {
            return false
        }
        return true
    }

    public toString(): string {
        let result: string = ""
        if (Array.isArray(this.left)) {
            result += "[" + this.left[0]
        } else {
            result += "(" + this.left
        }
        result += ","
        if (Array.isArray(this.right)) {
            result += this.right[0] + "["
        } else {
            result += this.right + ")"
        }
        return result
    }
}
