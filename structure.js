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
	"regex": "Regular expression",
	"invert": "Invert match"
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
	 * @param {string[]} modifiers 
	 * @param {boolean} isInverted 
	 */
	constructor (fields, modifiers, isInverted, values) {
		this.fields = fields;
		this.modifiers = modifiers;
		this.isInverted = isInverted;		
		this.values = values;
	}
}
/**
 * 
 * @param {string} keyString 
 */
function deserialiseSearchCheck(keyString, values) {
	if (!isSearchCheck(keyString)) throw "Not a search check!";


	let str = keyString.trim()
	let parts = str.split(/ +/);

	let fields = parts[0];

	let isInverted = false;
	if (fields.startsWith("~")) {
		isInverted = true;	
		fields = fields.substring(fields.indexOf("~") + 1);
	}

	fields = fields.split("+");
	let modifiers = [];
	if (parts.length > 1) {
		modifiers = parts[1].substring(1,parts[1].length - 1).split(",");
		modifiers = modifiers.map((element)=>{return element.trim();})
	}

	let isM = false;
	for (let m of modifiers) {
		if (Object.hasOwn(searchMethods, m)) {
			isM = true;
		}
	}
	if (!isM) {
		if (fields.length > 1) {
			modifiers.push("includes-word");
		}
		else {
			modifiers.push("includes");
		}
	}
	
	let valuesArr = [];
	if (typeof values == "string") {
		valuesArr.push(values);
	}
	else {
		valuesArr = values;
	}
	
	return new SearchCheck(fields, modifiers, isInverted, valuesArr);
}





class RuleContext {
	constructor() {
		this.type = "any";
		this.moderators_exempt = true;
		this.searchCheck = new SearchCheck([], ["includes"], false, []);
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

	reset() {
		this.type = "any";
		this.moderators_exempt = true;
		this.searchCheck = new SearchCheck([], ["includes"], false, []);
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
		switch(value) {
			case "any": {
				ruleContext.type = "any";
				break;
			}
			case "comment": {
				ruleContext.type = "comment";
				break;
			}
			case "submission": {
				ruleContext.type = "submission";
				break;
			}
			case "text submission": {
				ruleContext.type = "text";
				break;
			}
			case "link submission": {
				ruleContext.type = "link";
				break;
			}
			case "poll submission": {
				ruleContext.type = "poll";
				break;
			}
			case "gallery submission": {
				ruleContext.type = "gallery";
				break;
			}
			case "crosspost submission": {
				ruleContext.type = "crosspost";
				break;
			}
		}
	}
}

const readTriggers = {
	"modmail": (ruleContext) => {
		ruleContext.send_modmail = true;
	},
	"modmail_subject": this.modmail,
	
	"message": (ruleContext) => {
		ruleContext.send_message = true;
	},
	"message_subject": this.message,

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