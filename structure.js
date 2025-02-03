const itemTypes = {
	"any": "Any",
	"comment": "Comment",
	"submission": "Post",
	"text": "Text post",
	"link": "Link post",
	"poll": "Poll post",
	"gallery": "Gallery post",
	"crosspost": "Crosspost"
}


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

const miniActions = {
	"overwrite_flair": "Overwrite flair",
	"set_sticky": "Pin post",
	"set_nsfw": "Mark as NSFW",
	"set_spoiler": "Mark as spoiler",
	"set_contest_mode": "Enable contest mode for comment section",
	"set_locked": "Lock matched entity"
}
const numeralChecks = ["reports", "body_longer_than", "body_shorter_than"];
const checkboxes = ["do_set_flair", "send_message", "send_comment", "send_modmail", "comment_locked", "comment_stickied"];
const textboxes = ["action", "action_reason", "set_flair", "message_subject", "message", "comment", "modmail_subject", "modmail"];

const valueObjects = {
	"itemtype": itemTypes,
	"searchfields": searchFields,
	"searchmethods": searchMethods,
	"searchmodifiers": searchModifiers,
	"miscprops": miscList,
	"miniactions": miniActions
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

class SearchCheck {
	/**
	 * 
	 * @param {string[]} fields 
	 * @param {string} method
	 * @param {string[]} modifiers 
	 * @param {boolean} isInverted 
	 */
	constructor (fields, method, modifiers, isInverted, values) {
		this.fields = fields;
		this.method = method;
		this.modifiers = modifiers;
		this.isInverted = isInverted;		
		this.values = values;
	}
}


function identifySearchMethod(fields) {
	if (fields.length > 1) {
		return "includes-word";
	}
	else {
		switch(fields[0]) {
			case "domain":
				// approximation; this is technically supposed to be a special check for domains only
				return "full-exact";
			case "id":
				return "full-exact";
			case "url":
				return "includes";
			case "flair_text":
				return "full-exact";
			case "flair_css_class":
				return "full-exact";
			case "flair_template_id":
				return "full-exact";
			case "media_author":
				return "full-exact";
			case "media_author_url":
				return "full-exact";
			default:
				return "includes-word";
		}
	}
	
}


/**
 * 
 * @param {string} keyString 
 */
function deserialiseSearchCheck(keyString, values) {
	if (!isSearchCheck(keyString)) throw "Not a search check!";

	// remove extraneous whitespace and split keystring by condensed space (i.e. many spaces are counted as one)
	let parts = keyString.trim().split(/ +/);

	// the first bit should be the fields concatenated with pluses
	let fieldstring = parts[0];

	// if this check is inverted, the fieldstring starts with a tilde
	let isInverted = false;
	if (fieldstring.startsWith("~")) {
		isInverted = true;	
		fieldstring = fieldstring.substring(fieldstring.indexOf("~") + 1);
	}

	// some rules may have multiple searchchecks for the same fields; trim away the numeral indicator
	fieldstring = fieldstring.replace(/#\d+/, "");

	// turn the fieldstring into an array
	let fields = fieldstring.split("+");

	// get modifier list (may include method)
	let modifiers = [];
	if (parts.length > 1) {
		modifiers = parts[1].substring(1,parts[1].length - 1).split(",");
		modifiers = modifiers.map((element)=>{return element.trim();})
	}

	// figure out if a method is specified
	let method = "";
	modifiers.filter((val, idx, arr) => {
		let isMethod = !Object.keys(searchMethods).includes(val);
		if (isMethod) {
			method = val;
		}
		return !isMethod;
	});
	
	if (!method) {
		method = identifySearchMethod(fields);
	}
	
	
	let valuesArr = [];
	if (typeof values == "string") {
		valuesArr.push(values);
	}
	else {
		valuesArr = values;
	}
	
	return new SearchCheck(fields, method, modifiers, isInverted, valuesArr);
}

const typeNameMapping = {
	"any": "any",
	"comment":"comment",
	"submission": "submission",
	"text submission": "text",
	"link submission": "link",
	"poll submission": "poll",
	"gallery submission": "gallery",
	"crosspost submission": "crosspost"
}




class RuleContext {
	constructor() {
		this.type = "any";
		this.moderators_exempt = true;
		this.searchChecks = [];
		this.is_poll = false;
		this.is_gallery = false;
		this.is_edited = false;
		this.reports = 0;
		this.body_longer_than = 0;
		this.body_shorter_than = 0;

		this.action = "none";
		this.action_reason = "";
		this.do_set_flair = false;
		this.set_flair = "";
		this.overwrite_flair = false;
		this.set_sticky = false;
		this.set_nsfw = false;
		this.set_spoiler = false;
		this.set_contest_mode = false;
		this.set_locked = false;
		this.send_modmail = false;
		this.modmail_subject = "";
		this.modmail = "";
		this.send_message = false;
		this.message_subject = "";
		this.message = "";
		this.send_comment = false;
		this.comment = "";
		this.comment_locked = false;
		this.comment_stickied = false;
		
		this.updateHandlers = [];
	}

	get searchCheck() {
		console.trace("Read from searchcheck property is invalid!")

	}
	set searchCheck(a) {
		console.trace("Write to searchcheck property is invalid!");
	}

	reset() {
		this.type = "any";
		this.moderators_exempt = true;
		this.searchChecks = [];
		this.is_poll = false;
		this.is_gallery = false;
		this.is_edited = false;
		this.reports = 0;
		this.body_longer_than = 0;
		this.body_shorter_than = 0;

		this.action = "none";
		this.action_reason = "";
		this.do_set_flair = false;
		this.set_flair = "";
		this.overwrite_flair = false;
		this.set_sticky = false;
		this.set_nsfw = false;
		this.set_spoiler = false;
		this.set_contest_mode = false;
		this.set_locked = false;
		this.send_modmail = false;
		this.modmail_subject = "";
		this.modmail = "";
		this.send_message = false;
		this.message_subject = "";
		this.message = "";
		this.send_comment = false;
		this.comment = "";
		this.comment_locked = false;
		this.comment_stickied = false;
	}

	unredditise(parsedContents) {
		this.reset();

		for (let entry of Object.entries(parsedContents)) {
			if (Object.hasOwn(readTriggers, entry[0])) {
				readTriggers[entry[0]](this);
			}

			if (isSearchCheck(entry[0])) {
				this.searchChecks.push(deserialiseSearchCheck(entry[0], entry[1]));
			}
			else {
				if (Object.hasOwn(ruleMapping, entry[0])) {
					ruleMapping[entry[0]](this, entry[1]);
				}
				else if (Object.hasOwn(this, entry[0])) {
					this[entry[0]] = entry[1];
				}
				else {
					console.error("Did not understand key-value pair", entry);
				}
			}
		}
		this.update();
	}

	on(event, handler) {
		if (event == "update") {
			this.updateHandlers.push(handler);
		}
	}

	update() {
		for (let handler of this.updateHandlers) {
			handler(this);
		}
	}

	redditise() {
		let outObj = {};

		const defaultContext = new RuleContext();
		const noop = ()=>{/*no-op*/};
		let specialHandlers = 
		{"type": (ruleContext, out) =>{
			let revTypeNameMapping = {}
			for (let entry of Object.entries(typeNameMapping)) {
				revTypeNameMapping[entry[1]] = entry[0];
			}
	
			outObj.type = revTypeNameMapping[this.type];
		},
		"searchCheck":(ruleContext, out) =>{
			if (ruleContext.searchCheck.fields.length > 0) {
				let fieldString = ruleContext.searchCheck.fields.join("+");
				let ret = (ruleContext.searchCheck.isInverted) ? "~" : "";

				ret += fieldString;
				
				if (ruleContext.searchCheck.modifiers.length > 1) {
					let necessaryModifiers = [];
					for (let modifier of ruleContext.searchCheck.modifiers) {
						if (!((modifier == "includes" && ruleContext.searchCheck.fields.length == 1) || (modifier == "includes-word" && ruleContext.searchCheck.fields > 1))) {
							necessaryModifiers.push(modifier);
						}
					}

					ret += " (" + necessaryModifiers.join(", ") + ")";
				}

				out[ret] = ruleContext.searchCheck.values;
			}
			
		},
		"do_set_flair":(ruleContext, out) =>{
			if (ruleContext.do_set_flair) {
				out.set_flair = ruleContext.set_flair
			}
		}, 
		"send_comment": (ruleContext, out) =>{
			if (ruleContext.send_comment) {
				out.comment = ruleContext.comment;
				out.comment_locked = ruleContext.comment_locked;
				out.comment_stickied = ruleContext.comment_stickied;
			}
		}, 
		"send_message":(ruleContext, out) =>{
			if (ruleContext.send_message) {
				out.message = ruleContext.message;
				out.message_subject = ruleContext.message_subject;
			}

		}, 
		"send_modmail": (ruleContext, out) =>{
			if (ruleContext.send_modmail) {
				out.modmail = ruleContext.modmail;
				out.modmail_subject = ruleContext.modmail_subject;
			}
		},
		"updateHandlers": noop,
		"message": noop,
		"message_subject": noop,
		"modmail": noop,
		"modmail_subject": noop,
		"comment": noop,
		"comment_stickied": noop,
		"comment_locked": noop,
		"set_flair": noop
		};

		for (let id in this) {
			if (!(this[id] == defaultContext[id])) {
				if (Object.hasOwn(specialHandlers, id)) {
					specialHandlers[id](this,outObj);
				}
				else {
					outObj[id] = this[id];
				}
			}
		}

		return outObj;
	}

}

const ruleMapping = {
	/**
	 * @param {RuleContext} ruleContext 
	 * @param {string} value 
	 */
	"report_reason": (ruleContext, value) => {
		ruleContext.action_reason = value;		
	},
	/**
	 * @param {RuleContext} ruleContext 
	 * @param {string} value 
	 */
	"type": (ruleContext, value) => {
		if (!typeNameMapping[value]) throw "Error in type value read: " + value;
		ruleContext.type = typeNameMapping[value];
	}

}

const readTriggers = {
	"modmail": (ruleContext) => {
		ruleContext.send_modmail = true;
	},
	"message": (ruleContext) => {
		ruleContext.send_message = true;
	},

	"comment": (ruleContext) => {
		ruleContext.send_comment = true;
	},
	"set_flair": (ruleContext) => {
		ruleContext.do_set_flair = true;
	},
	"action": (ruleContext) => {
		ruleContext.action = action;
	}
}