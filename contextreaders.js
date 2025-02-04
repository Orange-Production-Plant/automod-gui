
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
	document.forms.condition.elements.ruleprops.elements.type.value = ruleContext.type;
}

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateNME(ruleContext) {
	document.forms.condition.elements.ruleprops.elements.nme.checked = !ruleContext.moderators_exempt;
}


/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateSearchCheck(ruleContext) {
	buildSearchChecks(ruleContext.searchChecks.length);

	let container = document.getElementById("searchchecks");
	
	for (let element of container.children) {
		if (element.dataset.index) {
			element.setValue(ruleContext.searchChecks[element.dataset.index]);
		}
	}
}


/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateMiscChecks(ruleContext) {
	resetCheckListAndTickBox("misc", objHasTrueKeys(Object.keys(miscList), ruleContext));
	
	for (let check of numeralChecks) {
		document.getElementById(check).value = ruleContext[check];
	}
}


/**
 * 
 * @param {RuleContext} ruleContext 
 */
function updateActionForm(ruleContext) {

	for (let box of checkboxes) {
		let element = document.getElementById(box);
		element.checked = ruleContext[box];
	}
	for (let box of textboxes) {
		let element = document.getElementById(box);
		element.value = ruleContext[box];
	}

	resetCheckListAndTickBox("miniactions", objHasTrueKeys(Object.keys(miniActions), ruleContext));

}

