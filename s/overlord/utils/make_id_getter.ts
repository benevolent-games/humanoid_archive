
export function make_id_getter() {
	let id = 0
	return () => id++
}
