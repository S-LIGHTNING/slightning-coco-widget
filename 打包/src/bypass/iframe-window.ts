declare global {
    interface Window {
        __slightning_coco_widget_iframe_window__: typeof window | null | undefined
    }
}

export function getIFrameWindow(): typeof window {
    if (window.__slightning_coco_widget_iframe_window__ == null) {
        var iframeElement: HTMLIFrameElement = document.createElement("iframe")
        iframeElement.sandbox.add("allow-same-origin")
        iframeElement.src = location.href
        iframeElement.style.display = "none"
        document.body.appendChild(iframeElement)
        Object.defineProperty(window, "__slightning_coco_widget_iframe_window__", {
            value: iframeElement.contentWindow,
            enumerable: false,
            configurable: false
        })
    }
    return window.__slightning_coco_widget_iframe_window__!
}

export function getIFrameWindowVar(name: string): any {
    return getIFrameWindow()[name.replace(/_/g, "") as any]
}
