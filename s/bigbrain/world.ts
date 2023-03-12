
import {system} from "./system.js"
import {Systematizer, Systems} from "./types.js"
import {make_id_getter} from "./world_aspects/make_id_puller.js"
import {Entity_Controls} from "./world_aspects/entity_controls.js"

export class World<State extends {}> {
	#systems: Systems<State>
	#get_id = make_id_getter()
	#entities = new Map<number, Partial<State>>()

	constructor(make_systems: Systematizer<State>) {
		this.#systems = make_systems(name => system(name))
	}

	entities = new Entity_Controls(this.#entities, this.#get_id)
}
