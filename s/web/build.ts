
import {buildWebsite} from "xiome/x/toolbox/hamster-html/website/build-website.js"

await buildWebsite({
	inputDirectory: "x/web/templates",
	outputDirectory: "x",
	excludes: [],
	logWrittenFile: path => console.log("write", path),
	context: {}
})

console.log("website done")
