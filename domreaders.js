


/**
 * 
 * @param {string} inputType 
 * @param {string} inputValue 
 * @param {string[]} inputClassList 
 * @param {string} inputID 
 * @returns {any}
 */
function defaultTypeMapper(inputType, inputValue, inputClassList = "", inputID = "") {
	switch (inputType) {
		case "text": {
			return inputValue;
		}
		case "number": {
			return parseFloat(inputValue);
		}
		case "tel": {
			return parseInt(inputValue);
		}
		case "checkbox": {
			return (inputValue == "on");
		}
		default: {
			return inputValue;
		}
	}
}

/**
 * Gets the values of the form elements marked with the provided class name
 * @param {string} className 
 * @param {defaultTypeMapper} typeMapper 
 * @returns {object} {element id: value}
 */
function collectForm(className, typeMapper = defaultTypeMapper) {
	let inputs = document.getElementsByClassName(className);

	let formObject = {};
	for (let input of inputs) {
		if (input.classList.contains("radiogroup")) {

		}
		else {
			formObject[input.id] = typeMapper(input.type, input.value, input.classList, input.id);
		}
	}

	return formObject;
}

function clearForm(className) {
	let inputs = document.getElementsByClassName(className);
	for (let input of inputs) {
		input.value = "";
	}
}





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
	
