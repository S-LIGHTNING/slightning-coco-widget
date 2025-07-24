// @ts-nocheck

(function() {
    const elements = document.querySelectorAll("[class^=\"style_LibraryMain\"]>[class^=\"style_ImageLibraryItem\"]")
    const result = {}
    for (const element of elements) {
        const $ = element.querySelector("img")
        result[$.id.match(/(?<=^image).*(?=\.svg)/)[0]] = $.src
    }
    copy(JSON.stringify(Object.fromEntries(Object.entries(result).sort((a, b) => a < b ? -1 : 1)), null, 4))
})()
