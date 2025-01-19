
/**
 * 
 * @param {string} parentId 
 * @param {string[]} childIds 
 */
function attachChecklistListeners(parentId, childIds, listener) {

	for (let id of childIds) {
		let element = document.getElementById(parentId + "-" + id);
		element.addEventListener("change", listener);
	}
}



function readChecklist(parentId) {

	let rootElement = document.getElementById(parentId);

	let ret = {}
	for (let element of rootElement.childNodes) {
		ret[element.dataset.value] = element.childNodes[0].checked;
	}
	return ret;
}

function readRadiolist(parentId) {

	let checklist = readChecklist(parentId);

	for (let id in checklist) {
		if (checklist[id]) return id;
	}
}


class FormListener {
	/**
	 * 
	 * @param {RuleContext} ruleContext 
	 */
	constructor(ruleContext) {
		this.ruleContext = ruleContext;
	}

	readItemtype(event) {
		this.ruleContext.type = readRadiolist("itemtype");
	}
	
	readFields(event) {
		this.ruleContext.searchCheck.fields = objHasTrueKeys(Object.keys(searchFields),readChecklist("fields"));
	}
	
	readSearchMethod(event) {
		this.ruleContext.searchCheck.modifiers = objHasTrueKeys(["case-sensitive", "regex"], readChecklist("matchmodifier"));
		this.ruleContext.searchCheck.modifiers.push(readRadiolist("matchtype"));
	}

	readMiscChecks(event) {
		let miscChecklistObj = readChecklist("misc");
		
		for (let box of Object.keys(miscChecklistObj)) {
			this.ruleContext[box] = miscChecklistObj[box];
		}
	}

	// reflectively called
	readnme(event) {
		let nmeCheckbox = document.getElementById("nme");
		this.ruleContext.moderators_exempt = !nmeCheckbox.checked;
	}
	readfieldmatch(event) {
		this.ruleContext.searchCheck.values = [];
		this.ruleContext.searchCheck.values.push(document.getElementById("fieldmatch").value);
	}
	


}
	
