/**
 * 
 * @param {HTMLUListElement} rootElement 
 * @param {object} valueObject 
 * @param {string} form The form to attach the checklist to
 */
function buildChecklist(rootElement, valueObject, form) {
	let lastLi;
	for (let entry of Object.entries(valueObject)) {
		const value = entry[0];
		const labelText = entry[1];
		
		let li = new ChecklistElement();
		
		li.dataset.value = value;
		li.innerText = labelText;

		rootElement.appendChild(li);
		lastLi = li;
	}

	lastLi.style.marginBottom = 0;
}

/**
 * 
 * @param {HTMLSelectElement} rootElement 
 * @param {object} valueObject
 * @param {string} form
 */
function buildDropdown(rootElement, valueObject, form) {
	rootElement
    for (let entry of Object.entries(valueObject)) {
		const value = entry[0];
		const labelText = entry[1];
		
		let option = document.createElement("option");
		
		option.value = value;
		option.innerText = labelText;

		rootElement.appendChild(option);
	}
}


function createLists() {
    const dropdowns = {
		"itemtype": [itemTypes, (event)=>{formListener.readItemtype(event)}],
		"matchtype": [searchMethods, (event)=>{formListener.readSearchMethod(event)}],
	}

	const checklists = {
		"fields": [searchFields, (event)=>{formListener.readFields(event)}],
		"matchmodifier": [searchModifiers, (event)=>{formListener.readSearchMethod(event)}],
		"misc": [miscList, (event)=>{formListener.readMiscChecks(event)}],
		"miniactions": [miniActions, (event)=>{formListener.readMiniactions(event)}]
	}

    for (let entry of Object.entries(dropdowns)) {
        let dropdowns = document.getElementsByClassName(entry[0]);
        
        for (let dropdown of dropdowns) {
            buildDropdown(dropdown, entry[1][0]);
        }
    }
    
	for (let entry of Object.entries(checklists)) {
		buildChecklist(document.getElementById(entry[0]), entry[1][0]);
		attachChecklistListeners(entry[0], Object.keys(entry[1][0]), entry[1][1]);
	}
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

	const addChangeListener = (id)=> {
		document.getElementById(id).addEventListener("change", (event) => {formListener["read" + id]()});
	}
	const addInputListener = (id)=> {
		document.getElementById(id).addEventListener("input", (event) => {formListener["read" + id]()});
	}

	addChangeListener("nme");
	addInputListener("fieldmatch");
	
	document.getElementById("invert-invert").addEventListener("change", (event) => {
		formListener.readinvert(event);
	})

	for (let check of numeralChecks) {
		document.getElementById(check).addEventListener("input", (event)=>{formListener.readTextInput(event);});
	}
	for (let box of checkboxes) {
		document.getElementById(box).addEventListener("change", (event)=>{formListener.readCheckboxInput(event)});
	}
	for (let box of textboxes) {
		document.getElementById(box).addEventListener("input", (event)=>{formListener.readTextInput(event)});
	}
}