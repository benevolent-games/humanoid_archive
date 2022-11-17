
export const system = <xComponents extends {}>() => ({
	label: (label: string) => ({
		selector: <xSelectedComponents extends Partial<xComponents>>(selector: (c: xComponents) => xSelectedComponents) => ({
			executor: (executor: (s: xSelectedComponents) => xSelectedComponents) => ({
				label,
				selector,
				executor,
			})
		})
	})
})
