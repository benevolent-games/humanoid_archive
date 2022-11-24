
import {getElements, themeElements, registerElements, themeCss, NubAction} from "@benev/nubs"

export function installNubs() {
	registerElements(
		themeElements(
			themeCss,
			getElements()
		)
	)
	return {
		listenForAction(listener: (event: NubAction) => void) {
			window.addEventListener(NubAction.eventName, <any>listener)
			return () => {
				window.removeEventListener(NubAction.eventName, <any>listener)
			}
		},
	}
}
