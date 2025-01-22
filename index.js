
/**
 * @type {Node.path}
 */
const path = window.nativeapis.path;
const fs = window.nativeapis.fs;
const yaml = window.nativeapis.yaml;


let fileList = []

let selectedFile = 1;
let sourcePath = "";


let ruleContext = new RuleContext();


/**
 * 
 * @param {MouseEvent} event 
 */
function selectFile(event) {
	let fileIndex = event.target.dataset.index;
	
	if (fileIndex != selectedFile) {
		const fileListElements = document.getElementsByClassName("filelist-button");


		fileListElements[selectedFile].style.backgroundColor = "";
		selectedFile = fileIndex;
		fileListElements[selectedFile].style.backgroundColor = "rgb(224, 165, 0)";

		let fileContents = fs.readFileSync(path.join(sourcePath, fileList[selectedFile].join(".")), {encoding:"utf8"});
    	let parsedContents = yaml.parse(fileContents);
		
		ruleContext.reset();

		for (let entry of Object.entries(parsedContents)) {
			if (Object.hasOwn(readTriggers, entry[0])) {
				readTriggers[entry[0]](ruleContext);
			}

			if (isSearchCheck(entry[0])) {
				ruleContext.searchCheck =  deserialiseSearchCheck(entry[0], entry[1]);
			}
			else {
				if (Object.hasOwn(ruleMapping, entry[0])) {
					ruleMapping[entry[0]](ruleContext, entry[1]);
				}
				else if (Object.hasOwn(ruleContext, entry[0])) {
					ruleContext[entry[0]] = entry[1];
				}
				else {
					console.error("Did not understand key-value pair", entry);
				}
			}
		}
		ruleContext.update();
	}
}

function saveToFile(event) {
	fs.writeFileSync((path.join(sourcePath, fileList[selectedFile].join("."))), yaml.stringify(ruleContext.redditise()));
}


/**
 * 
 * @param {HTMLUListElement} rootElement 
 * @param {object} valueObject 
 */
function buildChecklist(rootElement, valueObject, isCheck = true) {
	let lastLi;
	for (let entry of Object.entries(valueObject)) {
		const value = entry[0];
		const labelText = entry[1];
		
		let li;
		if (isCheck) {
			li = new ChecklistElement();
		}
		else {
			li = new RadiolistElement();
		}
		
		li.dataset.value = value;
		li.innerText = labelText;

		rootElement.appendChild(li);
		lastLi = li;
	}

	lastLi.style.marginBottom = 0;
}


window.addEventListener("DOMContentLoaded", ()=>{
	const folderSelectedCallback = (folder) => {
		console.log(folder)
		sourcePath = folder;

		const fileListElement = document.getElementById("filelist");
		const files = fs.readdirSync(folder, {"withFileTypes":true});
		let i = 0;

		
		for (const file of files) {
			
			/**
			 * @type {string}
			 */
			let fileName = file.name;
			let bits = fileName.split(".")
			fileList.push(bits);

			baseName = bits[0]
			let item = document.createElement("li");
			item.textContent = baseName;
			item.classList.add("listbutton");
			item.classList.add("filelist-button")
			item.dataset.index = i;
			i++;
			item.addEventListener("click", selectFile);

			fileListElement.appendChild(item);
		}
		
		fileListElement.lastChild.style.marginBottom = 0;		
	}

	// DEBUG
	folderSelectedCallback("./source/")
	/*
	window.nativeapis.openDirectoryDialog("Please select automod source files directory")
	window.nativeapis.on("folderSelected", folderSelectedCallback)
	*/

	let formListener = new FormListener(ruleContext);

	const checklists = {
		"itemtype": [itemTypes, false, (event)=>{formListener.readItemtype(event)}],
		"fields": [searchFields, true, (event)=>{formListener.readFields(event)}],
		"matchtype": [searchMethods, false, (event)=>{formListener.readSearchMethod(event)}],
		"matchmodifier": [searchModifiers, true, (event)=>{formListener.readSearchMethod(event)}],
		"misc": [miscList, true, (event)=>{formListener.readMiscChecks(event)}],
		"miniactions": [miniActions, true, (event)=>{formListener.readMiniactions(event)}]
	}

	for (let entry of Object.entries(checklists)) {
		buildChecklist(document.getElementById(entry[0]), entry[1][0], entry[1][1]);
		attachChecklistListeners(entry[0], Object.keys(entry[1][0]), entry[1][2]);
	}


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
	
	selectFile({target:{dataset:{index:0}}})
	
	document.getElementById("save").addEventListener("click", saveToFile);
	
	rcStore = ruleContext;
})

