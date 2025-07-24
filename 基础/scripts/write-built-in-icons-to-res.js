const path = require("path")
const { promises: fs } = require("fs")

;(async () => {
    const icons = JSON.parse(String(await fs.readFile(path.resolve(__dirname, "icons.json"))))
    for (const icon of icons) {
        fs.writeFile(path.resolve(__dirname, "../res/icon/", icon.id + ".svg"),
`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${icon.width}" height="${icon.height}" fill="currentColor" aria-hidden="true" focusable="false">
    ${icon.element.trim()}
</svg>
`)
    }
})()
