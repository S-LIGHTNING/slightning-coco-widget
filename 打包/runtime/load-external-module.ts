declare global {
    var __slightning_coco_widget_modules_cache__: Record<string, Promise<unknown>>
}

const modulesCache = global.__slightning_coco_widget_modules_cache__ ?? (global.__slightning_coco_widget_modules_cache__ = {})

export default function loadExternalModule(url: string): Promise<unknown> {
    return modulesCache[url] ?? (modulesCache[url] = (async (): Promise<unknown> => {
        try {
            const code: string = await (await fetch(url)).text()
            const exports: unknown = {}, module = { exports }
            new Function("module", "exports", code)(module, exports)
            return module.exports
        } catch (error) {
            console.log(`Failed to load module from ${url}`, error)
            throw error
        }
    })())
}
