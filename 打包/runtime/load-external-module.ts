const modulesCache: Record<string, Promise<unknown>> = {}

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
