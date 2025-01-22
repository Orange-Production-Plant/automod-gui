
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
		this.ruleContext.update();
	}
	
	readFields(event) {
		this.ruleContext.searchCheck.fields = objHasTrueKeys(Object.keys(searchFields),readChecklist("fields"));
		this.ruleContext.update();
	}
	
	readSearchMethod(event) {
		this.ruleContext.searchCheck.modifiers = objHasTrueKeys(["case-sensitive", "regex"], readChecklist("matchmodifier"));
		this.ruleContext.searchCheck.modifiers.push(readRadiolist("matchtype"));
		this.ruleContext.update();
	}

	readMiscChecks(event) {
		let miscChecklistObj = readChecklist("misc");
		
		for (let box of Object.keys(miscChecklistObj)) {
			this.ruleContext[box] = miscChecklistObj[box];
		}
		this.ruleContext.update();
	}

	readMiniactions(event) {
		let miniactionsChecklistObj = readChecklist("miniactions");
		
		for (let box of Object.keys(miniactionsChecklistObj)) {
			this.ruleContext[box] = miniactionsChecklistObj[box];
		}
		this.ruleContext.update();
	}

	/**
	 * 
	 * @param {InputEvent} event 
	 */
	readTextInput(event) {
		/**
		 * @type {HTMLInputElement}
		 */
		let target = event.target;
		this.ruleContext[target.id] = defaultTypeMapper(target.type, target.value);
		this.ruleContext.update();
	}
	/**
	 * 
	 * @param {Event} event 
	 */
	readCheckboxInput(event) {
		/**
		 * @type {HTMLInputElement}
		 */
		let target = event.target;
		this.ruleContext[target.id] = target.checked;
		this.ruleContext.update();
	}

	// reflectively called
	readnme(event) {
		let nmeCheckbox = document.getElementById("nme");
		this.ruleContext.moderators_exempt = !nmeCheckbox.checked;
		this.ruleContext.update();
	}
	readfieldmatch(event) {
		this.ruleContext.searchCheck.values = [];
		this.ruleContext.searchCheck.values.push(document.getElementById("fieldmatch").value);
		this.ruleContext.update();
	}
	readinvert(event) {
		this.ruleContext.searchCheck.isInverted = document.getElementById("invert-invert").checked;
		this.ruleContext.update();
	}
	
	


}
	
