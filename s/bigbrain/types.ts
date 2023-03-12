
export type Rec = Record<string, unknown>

export type Entity<State extends Rec> = Partial<State>

export type Entity_Map<State extends Rec> = Map<number, Entity<State>>

export type Behavior<State extends Rec, Keys extends keyof State> = (
	(entity_state: Pick<State, Keys>) => void
)

export type Behaviors<State extends Rec, Keys extends keyof State> = [
	string,
	Behavior<State, Keys>,
][]

export type System_Spec<State extends Rec, Keys extends keyof State> = {
	selector: Keys[]
	frequency: number
	behaviors: Behaviors<State, Keys>
}

export type System<State extends Rec, Keys extends keyof State> = {
	name: string
} & System_Spec<State, Keys>

export type Systems<State extends Rec> = System<State, keyof State>[]

export type System_Setup<State extends Rec> = (
	(name: string) =>
		<Keys extends keyof State>(s: System_Spec<State, Keys>) =>
			System<State, Keys>
)

export type Systematizer<State extends Rec> = (
	(s: System_Setup<State>) => Systems<State>
)
