
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
		
		ruleContext.unredditise(parsedContents);
	}
}

function saveToFile(event) {
	fs.writeFileSync((path.join(sourcePath, fileList[selectedFile].join("."))), yaml.stringify(ruleContext.redditise()));
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
			 * @type {string[]}
			 */
			let bits = file.name.split(".")
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

	createLists();
	addChecklistListeners(ruleContext, formListener);
	
	selectFile({target:{dataset:{index:0}}})
	
	document.getElementById("save").addEventListener("click", saveToFile);
	
	rcStore = ruleContext;
})

