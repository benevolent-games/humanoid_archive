
import {Id_Getter} from "./make_id_puller.js"
import {Entity, Entity_Map} from "../types.js"

export class Entity_Controls<State extends {}> {
	#get_id: Id_Getter
	#entities: Entity_Map<State>

	constructor(
			entities: Entity_Map<State>,
			get_id: () => number,
		) {

		this.#get_id = get_id
		this.#entities = entities
	}

	add(entity: Entity<State>) {
		const id = this.#get_id()
		this.#entities.set(id, entity)
		return id
	}

	delete(id: number) {
		this.#entities.delete(id)
	}
}
