
export type Rec = Record<string, unknown>

export type Activity<
	S extends Rec = Rec,
	K extends keyof S = keyof S
> = (state: Pick<S, K>, id: number) => void

export type Behavior<
		S extends Rec = any,
		K extends keyof S = any
	> = {
	name: string
	selector: K[]
	frequency: Frequency
	activity: Activity<S, K>
}

export type BehaviorArrayMaker<S extends Rec> = (
	(b: (name: string) => BehaviorMaker<S>) => Behavior[]
)

export type BehaviorMaker<S extends Rec> = {
	selector: <K extends keyof S>(...selector: K[]) => {
		activity: (f: Frequency, a: Activity<S, K>) => Behavior<S, K>
	}
}

export enum Frequency {
	High,
	Medium,
	Low,
}

export type Freq<T> = {
	high: T
	medium: T
	low: T
}

export type OverlordParams<S extends Rec> = {
	behaviors: Behavior<S, keyof S>[]
	frequencies: Freq<number>
}
