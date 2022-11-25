
export function wirePointerLockAttribute(element: HTMLElement, attributeName: string) {
	document.addEventListener("pointerlockchange", () => {
		const isPointerLocked = !!document.pointerLockElement
		element.setAttribute(
			attributeName,
			isPointerLocked
				? "true"
				: "false",
		)
	})
}
