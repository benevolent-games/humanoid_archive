
export type Id_Getter = () => number

export function make_id_getter(): Id_Getter {
	let id = 0
	return () => id++
}
