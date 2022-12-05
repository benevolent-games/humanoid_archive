
import {getElements, themeElements, registerElements, themeCss} from "@benev/nubs"

export function installNubs() {
	registerElements(
		themeElements(
			themeCss,
			getElements(),
		)
	)
}
