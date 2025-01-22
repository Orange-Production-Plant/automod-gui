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
		default: {
			return inputValue;
		}
	}
}

/**
 * Gets the values of the form elements marked with the provided class name
 * @param {string} className 
 * @param {function} typeMapper 
 * @returns {object} {element id: value}
 */
function collectForm(className, typeMapper = defaultTypeMapper) {
	let inputs = document.getElementsByClassName(className);

	let formObject = {};
	for (let input of inputs) {
		formObject[input.id] = typeMapper(input.type, input.value, input.classList, input.id);
	}

	return formObject;
}

function clearForm(className) {
	let inputs = document.getElementsByClassName(className);
	for (let input of inputs) {
		input.value = "";
	}
}


let rcStore = {};

function onDemoUpdate() {
	testRule(rcStore);
}

/**
 * 
 * @param {HTMLElement} rootElement 
 */
function constructSubmissionCommon(rootElement) {
	
	let titleLabel = document.createElement("label");
	let titleInput = document.createElement("input");
	
	titleInput.id = "title";
	titleInput.name = titleInput.id;
	titleInput.type = "text";
	titleInput.oninput = onDemoUpdate;

	titleLabel.innerText = "Title:"
	titleLabel.htmlFor = titleInput.id;
	titleLabel.classList.add("sectionlabel");

	rootElement.appendChild(titleLabel);
	rootElement.appendChild(document.createElement("br"));
	rootElement.appendChild(titleInput);
}


/**
 * 
 * @param {HTMLElement} rootElement 
 */
function constructTextPost(rootElement) {
	constructSubmissionCommon(rootElement);

	let bodyLabel = document.createElement("label");
	let bodyInput = document.createElement("textarea");

	bodyInput.id = "body";
	bodyInput.name = bodyInput.id;
	bodyInput.oninput = onDemoUpdate;

	bodyLabel.innerText = "Body:";
	bodyLabel.htmlFor = bodyInput.id;
	bodyLabel.classList.add("sectionlabel");
	bodyLabel.classList.add("shovetop");

	rootElement.appendChild(document.createElement("br"));
	rootElement.appendChild(bodyLabel);
	rootElement.appendChild(bodyInput);
}



let currentType = "";

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function constructDemoArea(ruleContext) {
	if (ruleContext.type != currentType) {
		let demoroot = document.getElementById("demoroot");

		demoroot.replaceChildren();
		
		
		constructTextPost(demoroot);
		
		demoroot.appendChild(document.createElement("br"));
		demoroot.appendChild(document.createElement("br"));
		demoroot.appendChild(document.createElement("br"));
		demoroot.appendChild(document.createElement("br"));
	
		let outputContainer = document.createElement("div");
		let outputHeader = document.createElement("h5");
		let output = document.createElement("p");
	
		
		outputHeader.innerText = "Output: ";
		outputHeader.classList.add("sectionlabel");
		
		output.innerText = "~~loading~~";
		output.id = "output";
	
		outputContainer.appendChild(outputHeader);
		outputContainer.appendChild(output);
	
		demoroot.appendChild(outputContainer);

		currentType = ruleContext.type;
	}
}





function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * 
 * @param {string} values 
 * @param {string[]} modifiers 
 */
function buildMatchRegex(value, modifiers) {

	let caseSensitive = modifiers.includes("case-sensitive");
	let isRegex = modifiers.includes("regex");

	let regexMethodPairs = {
		"includes": ["", ""],
		"includes-word": ["\\b", "\\b"],
		"starts-with": ["^", ""],
		"ends-with": ["", "$"],
		"full-exact": ["^", "$"],
		"full-text": ["[\\s\\.\\!\\?]*^", "$[\\s\\.\\!\\?]*"]
	}

	let searchMethod = modifiers.find((val, idx, arr)=>{
		return Object.keys(regexMethodPairs).includes(val);
	})
	if (!searchMethod) throw "Unknown search method!";

	let regexString = ""

	if (isRegex) {
		regexString = value;
	}
	else {
		regexString = escapeRegExp(value);
	}

	let regexMethodPair = regexMethodPairs[searchMethod];

	regexString = regexMethodPair[0] + regexString + regexMethodPair[1];


	return new RegExp(regexString, (caseSensitive) ? "" : "i");
	
}


/**
 * 
 * @param {RuleContext} ruleContext 
 */
function testRule(ruleContext) {

	for (let field of ruleContext.searchCheck.fields) {
		let el;
		if (el = document.getElementById(field)) {
			for (let value of ruleContext.searchCheck.values) {
				let regex = buildMatchRegex(value, ruleContext.searchCheck.modifiers);
				
				let output = document.getElementById("output");
				let result = regex.exec(el.value);
				if (!ruleContext.searchCheck.isInverted){
					if (result) {
						output.innerText = "Test " + result[0] +  " matched on field " + field + "!"
						return;
					}
					else {
						output.innerText = "No match!";
					}
				}
				else {
					if (result) {
						output.innerText = "No match!";
					}
					else {
						output.innerText = "Test failed to match on field " + field + "!"
						return;
					}
				}
				
			}
			
		}
	}
}