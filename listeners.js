
/**
 * 
 * @param {string} parentId 
 * @param {string} checkedValue 
 */
function resetRadioListAndTickBox(parentId, checkedValue) {
	const rootElement = document.getElementById(parentId);

	for (let element of rootElement.childNodes) {
		element.childNodes[0].checked = false;
	}
	
	/**
	 * @type {HTMLInputElement}
	 */
	const checkboxElement = document.getElementById(parentId + "-" + checkedValue);
	if (!checkboxElement) throw parentId + "-" + checkedValue + "is not a valid type id!!!"

	checkboxElement.checked = true;
}

/**
 * 
 * @param {string} parentId 
 * @param {string[]} checkedValues 
 */
function resetCheckListAndTickBox(parentId, checkedValues) {
	const rootElement = document.getElementById(parentId);

	for (let element of rootElement.childNodes) {
		element.childNodes[0].checked = false;
	}
	/**
	 * @type {HTMLInputElement}
	 */
	for (let checkedValue of checkedValues) {
		const checkboxElement = document.getElementById(parentId + "-" + checkedValue);
		if (!checkboxElement) throw parentId + "-" + checkedValue + "is not a valid type id!!!"
	
		checkboxElement.checked = true;
	}
}
	


/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateItemType(ruleContext) {
   resetRadioListAndTickBox("itemtype", ruleContext.type)
}

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateNME(ruleContext) {
	const checkboxElement = document.getElementById("nme");
	checkboxElement.checked = !ruleContext.moderators_exempt;
}

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateFields(ruleContext) {
	resetCheckListAndTickBox("fields", ruleContext.searchCheck.fields);
}
/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateSearchMethod(ruleContext) {
	let combinableModifiers = [];
	
	for (let modifier of ruleContext.searchCheck.modifiers) {
		if (Object.hasOwn(searchModifiers, modifier)) {
			combinableModifiers.push(modifier);
		}
		else if (Object.hasOwn(searchMethods, modifier)) {
			resetRadioListAndTickBox("matchtype", modifier);
		}
		else {
			throw "Fundamental error! " + modifier; 
		}
	}

	resetCheckListAndTickBox("matchmodifier", combinableModifiers);

	const invertCheckbox = document.getElementById("matchmodifier-invert");
	invertCheckbox.checked = ruleContext.searchCheck.isInverted;
}

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateMatchText(ruleContext) {
	let textArea = document.getElementById("fieldmatch");
	let vals = ruleContext.searchCheck.values;
	if (vals.length > 0) {
		textArea.innerText = vals[0];
	}
	else {
		textArea.innerText = "";
	}	
}

/**
 * 
 * @param {any[]} list 
 * @param {object} obj 
 * @returns 
 */
function objHasTrueKeys(list, obj) {
	let ret = [];
	for (let val of list) {
		if (obj[val]){
			ret.push(val);
		}
	}
	return ret;
}
/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateMiscChecks(ruleContext) {
	resetCheckListAndTickBox("misc",objHasTrueKeys(Object.keys(miscList), ruleContext));
}

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateNumeralChecks(ruleContext) {
	let numeralChecks = ["reports", "body_longer_than", "body_shorter_than"];

	for (let check of numeralChecks) {
		document.getElementById(check).value = ruleContext[check];
	}
}

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateActionForm(ruleContext) {

	let checkboxes = ["do_set_flair", "send_message", "send_comment", "send_modmail", "comment_locked", "comment_stickied"];
	let textboxes = ["action", "action_reason", "set_flair", "message_subject", "message", "comment", "modmail_subject", "modmail"];

	for (let box of checkboxes) {
		let element = document.getElementById(box);
		element.checked = ruleContext[box];
	}
	for (let box of textboxes) {
		let element = document.getElementById(box);
		element.value = ruleContext[box];
	}

}

