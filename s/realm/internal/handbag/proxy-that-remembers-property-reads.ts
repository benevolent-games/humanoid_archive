
export function proxyThatRemembersPropertyReads<R extends {[key: string]: any}>(
		target: R
	) {

	const reads = new Set<string>()

	const proxy: R = new Proxy(target, {
		get(t, p: string) {
			reads.add(p)
			return t[p]
		}
	})

	return [proxy, reads] as const
}
