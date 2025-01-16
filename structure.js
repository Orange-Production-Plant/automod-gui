

const searchFields = {
	"id": "Post ID",
	"title": "Title",
	"domain": "Domain name",
	"url": "URL",
	"body": "Body text",
	"flair_text": "Flair text",
	"flair_css_class": "Flair CSS class",
	"flair_template_id": "Flair template ID",
	"poll_option_text": "Poll option text",
	"poll_option_count": "Poll option count",
	"crosspost_id": "Crosspost ID",
	"crosspost_title": "Crosspost title"
}

const searchMethods = {
	"includes": "Includes",
	"includes-word": "Includes word",
	"starts-with": "Starts with",
	"ends-with": "Ends with",
	"full-exact": "Is exactly",
	"full-text": "Is exactly (trimmed)",
}
const searchModifiers = {
	"case-sensitive": "Case sensitive",
	"regex": "Regular expression"
}

const miscList = {
	"is_poll": "Is poll",
	"is_gallery": "Is gallery",
	"is_edited": "Is edited"
}


/**
 * @param {string} keyString 
 */
function isSearchCheck(keyString) {

	for (let field in searchFields) {
		if (keyString.includes(field)) {
			return true;
		}
	}
	return false;
}

/**
 * 
 * @param {string} keyString 
 */
function deserialiseSearchCheck(keyString) {
	if (!isSearchCheck(keyString)) throw "Not a search check!";

	let ret = {};
	ret.modifiers = [];

	let str = keyString.trim()
	let parts = str.split(/ +/);

	let fields = parts[0];
	if (fields.startsWith("~")) {
		ret.inverted = true;
		fields = fields.substring(fields.indexOf("~"));
	}
	else {
		ret.inverted = false;
	}
	fields = fields.split("+");
	

	if (parts.length > 1) {
		let modifiers = parts[1];
		modifiers = modifiers.substring(1,modifiers.length - 1).split(",");
		modifiers = modifiers.map((element)=>{return element.trim();})
		ret.modifiers = modifiers;
	}
	ret.fields = fields
	
	return ret;
}