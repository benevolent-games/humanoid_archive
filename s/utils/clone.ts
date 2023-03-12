
export type Cloner = <X>(x: X) => X

export const clone: Cloner = (
	(typeof window.structuredClone === "function")
		? x => structuredClone(x)
		: x => JSON.parse(JSON.stringify(x))
)
