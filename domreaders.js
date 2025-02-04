


/**
 * 
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input
 * @returns {any}
 */
function defaultTypeMapper(input) {
	let inputValue = input.value;

	switch (input.type) {
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
			return (input.checked);
		}
		default: {
			return inputValue;
		}
	}
}

/**
 * Gets the values of the form elements marked with the provided class name
 * @param {HTMLFormElement} form
 * @param {defaultTypeMapper} typeMapper 
 * @returns {object} {element id: value}
 */
function collectForm(form, typeMapper = defaultTypeMapper) {
	let formObject = {};
	for (let input of form.elements) {
		if (input.tagName == "FIELDSET") {
			// do nothing
		}
		else {
			if (input.dataset.value) {
				//if (!formObject[input.dataset.container]) formObject[input.dataset.container] = {}
				formObject[input.dataset.value] = typeMapper(input);
			}
			else {
				formObject[input.id] = typeMapper(input);
			}
		}
	}
	return formObject;
}


function readConditionForm(ruleContext) {
	let form = document.forms.condition;
	let formObject = collectForm(form);

	for (let [key, value] of Object.entries(formObject)) {
		if (Object.hasOwn(ruleContext, key)) {
			ruleContext[key] = value;
		}
	}

	ruleContext.moderators_exempt = !formObject.nme;

	let searchCheckContainer = document.getElementById("searchchecks");

	for (let element of searchCheckContainer.children) {
		ruleContext.searchChecks[element.dataset.index] = element.getValue();
	}
}


function readActionForm(ruleContext) {
	let form = document.forms.actionform;
	let formObject = collectForm(form);
	
	for (let [key, value] of Object.entries(formObject)) {
		if (Object.hasOwn(ruleContext, key)) {
			ruleContext[key] = value;
		}
	}
}





