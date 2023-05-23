
import basic_head from "./basic_head.html.js"
import {webpage, html, TemplateBasics, HtmlTemplate} from "@benev/turtle"

export type Renderer = (b: TemplateBasics) => HtmlTemplate | void

export default ({
		title,
		html_class,
		head = () => {},
		main = () => {},
	}: {
		title: string
		html_class: string
		head?: Renderer
		main?: Renderer
	}) => webpage(async(basics) => html`

	<!doctype html>
	<html class="${html_class}">
		<head>
			${basic_head(basics, {title})}
			${head(basics)}
		</head>
		<body>
			${main(basics)}
		</body>
	</html>

`)

