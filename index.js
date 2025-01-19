
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

/**
 * 
 * @param {HTMLUListElement} rootElement 
 * @param {object} idObject 
 */
function buildChecklist(rootElement, idObject) {
	let lastLi;
	for (let entry of Object.entries(idObject)) {
		const id = entry[0];
		const labelText = entry[1];

		let li = new ChecklistElement();

		li.dataset.id = id;
		li.innerText = labelText;

		rootElement.appendChild(li);
		lastLi = li;
	}

	lastLi.style.marginBottom = 0;
}
/**
 * 
 * @param {HTMLUListElement} rootElement 
 * @param {object} valueObject 
 */
function buildRadiolist(rootElement, valueObject) {
	let lastLi;
	for (let entry of Object.entries(valueObject)) {
		const value = entry[0];
		const labelText = entry[1];

		let li = new RadiolistElement();

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
	folderSelectedCallback("../source/")
	/*
	window.nativeapis.openDirectoryDialog("Please select automod source files directory")
	window.nativeapis.on("folderSelected", folderSelectedCallback)
	*/

	buildRadiolist(document.getElementById("itemtype"), itemTypes);
	buildChecklist(document.getElementById("fields"), searchFields);
	buildRadiolist(document.getElementById("matchtype"), searchMethods);
	buildChecklist(document.getElementById("matchmodifier"), searchModifiers);
	buildChecklist(document.getElementById("misc"), miscList);
	buildChecklist(document.getElementById("miniactions"), miniActions);

	ruleContext.on("update", updateItemType);
	ruleContext.on("update", updateNME);
	ruleContext.on("update", updateFields);
	ruleContext.on("update", updateSearchMethod);
	ruleContext.on("update", updateMatchText);
	ruleContext.on("update", updateMiscChecks);
	ruleContext.on("update", updateNumeralChecks);
	ruleContext.on("update", updateActionForm);

	selectFile({target:{dataset:{index:0}}})
})

