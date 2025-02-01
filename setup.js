


function buildSearchCheck() {
	let scDiv = document.createElement("div");
	let fieldDiv = document.createElement("div");

	let fieldView = document.createElement("div");



}





function addChecklistListeners(ruleContext, formListener) {
	ruleContext.on("update", updateItemType);
	ruleContext.on("update", updateNME);
	ruleContext.on("update", updateFields);
	ruleContext.on("update", updateSearchMethod);
	ruleContext.on("update", updateMatchText);
	ruleContext.on("update", updateMiscChecks);
	ruleContext.on("update", updateNumeralChecks);
	ruleContext.on("update", updateActionForm);

	ruleContext.on("update", constructDemoArea);
	ruleContext.on("update", testRule);

	const addChangeListener = (id) => {
		document.getElementById(id).addEventListener("change", (event) => { formListener["read" + id]() });
	}
	const addInputListener = (id) => {
		document.getElementById(id).addEventListener("input", (event) => { formListener["read" + id]() });
	}

	addChangeListener("nme");
	addInputListener("fieldmatch");

	document.getElementById("invert-invert").addEventListener("change", (event) => {
		formListener.readinvert(event);
	})

	for (let check of numeralChecks) {
		document.getElementById(check).addEventListener("input", (event) => { formListener.readTextInput(event); });
	}
	for (let box of checkboxes) {
		document.getElementById(box).addEventListener("change", (event) => { formListener.readCheckboxInput(event) });
	}
	for (let box of textboxes) {
		document.getElementById(box).addEventListener("input", (event) => { formListener.readTextInput(event) });
	}
}