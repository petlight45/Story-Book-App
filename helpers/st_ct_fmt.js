module.exports = (text, max_length=50) => {
	let regex = /(\<.+?>|\&.+\;)/g
	let filtered_text = text.replace(regex, "")
	console.log(filtered_text,text,"s")
	return (filtered_text.length <= max_length)?filtered_text:filtered_text.slice(0,max_length)+'.....'
}