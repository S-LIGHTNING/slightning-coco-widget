// @ts-nocheck

(function() {
    const parentElement = document.querySelector("[class^=\"App_layout\"]")?.children[0]
    const icons = Array.from(parentElement.children).map($ => ({
        id: $.id,
        width: parseInt($.getAttribute("viewBox").split(" ")[2]),
        height: parseInt($.getAttribute("viewBox").split(" ")[3]),
        element: $.innerHTML
    }))
    copy(JSON.stringify(icons, null, 4))
})()
