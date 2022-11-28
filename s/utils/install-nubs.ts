
import {getElements, themeElements, registerElements, themeCss, NubActionEvent} from "@benev/nubs"

export function installNubs() {
	registerElements(
		themeElements(
			themeCss,
			getElements()
		)
	)
	return {
		listenForAction(listener: (event: NubActionEvent) => void) {
			window.addEventListener(NubActionEvent.eventName, <any>listener)
			return () => {
				window.removeEventListener(NubActionEvent.eventName, <any>listener)
			}
		},
	}
}
