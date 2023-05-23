
import {html, TemplateBasics} from "@benev/turtle"

export default ({v}: TemplateBasics, {title}: {
		title: string
	}) => html`

	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<meta name="darkreader" content="dark"/>

	<title>${title}</title>

	<link rel=stylesheet href="${v("/styles.css")}"/>
`

