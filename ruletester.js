

let rcStore = {};

function onDemoUpdate() {
	testRule(rcStore);
}

/**
 * 
 * @param {HTMLElement} rootElement 
 */
function constructTitle(rootElement) {
	
	let titleLabel = document.createElement("label");
	let titleInput = document.createElement("input");
	
	titleInput.id = "title";
	titleInput.name = titleInput.id;
	titleInput.classList.add("demoform");
	titleInput.type = "text";
	titleInput.oninput = onDemoUpdate;

	titleLabel.innerText = "Title:"
	titleLabel.htmlFor = titleInput.id;

	rootElement.appendChild(titleLabel);
	rootElement.appendChild(document.createElement("br"));
	rootElement.appendChild(titleInput);
}



/**
 * 
 * @param {HTMLElement} rootElement 
 */
function constructComment(rootElement) {
	
	let commentLabel = document.createElement("label");
	let commentInput = document.createElement("textarea");
	

	commentInput.id = "comment-" + rootElement.dataset.id;
	commentInput.name = commentInput.id;
	commentInput.classList.add("comment");
	commentInput.classList.add("demoform");
	commentInput.oninput = onDemoUpdate;
	commentInput.cols = 30;
	commentInput.rows = 4;


	commentLabel.innerText = (rootElement.dataset.id == 0) ? "Top-level comment" : "Reply comment";
	commentLabel.htmlFor = commentInput.id;

	rootElement.appendChild(commentLabel);
	rootElement.appendChild(document.createElement("br"));
	rootElement.appendChild(commentInput);
	maxComment++;
}


/**
 * 
 * @param {HTMLElement} rootElement 
 */
function constructPostBody(rootElement) {
	let bodyLabel = document.createElement("label");
	let bodyInput = document.createElement("textarea");

	bodyInput.id = "body";
	bodyInput.name = bodyInput.id;
	bodyInput.classList.add("demoform");
	bodyInput.oninput = onDemoUpdate;
	bodyInput.cols = 30;
	bodyInput.rows = 4;

	bodyLabel.innerText = "Body:";
	bodyLabel.htmlFor = bodyInput.id;

	rootElement.appendChild(bodyLabel);
	rootElement.appendChild(document.createElement("br"));
	rootElement.appendChild(bodyInput);
}


function constructTitleArea(postContainer) {
	let titleContainer = document.createElement("div");
	titleContainer.classList.add("smallcontainer");
	titleContainer.id = "title-container";
	postContainer.appendChild(titleContainer);
	constructTitle(titleContainer);
}

function constructBodyArea(postContainer) {
	let bodyContainer = document.createElement("div");
	bodyContainer.classList.add("smallcontainer");
	bodyContainer.id = "body-container";
	postContainer.appendChild(bodyContainer);
	constructPostBody(bodyContainer);
}

function constructCommentArea(demoroot) {
	let commentContainer = document.createElement("div");
	commentContainer.classList.add("groupbox");
	commentContainer.classList.add("shovetop");
	commentContainer.id = "comment-container";
	demoroot.appendChild(commentContainer);

	let topLevelCommentContainer = document.createElement("div");
	topLevelCommentContainer.classList.add("smallcontainer");
	topLevelCommentContainer.dataset.id = 0;
	topLevelCommentContainer.id = "comment-0-container";

	let replyCommentContainer = document.createElement("div");
	replyCommentContainer.classList.add("pushtop");
	replyCommentContainer.classList.add("smallcontainer");
	replyCommentContainer.dataset.id = 1;
	replyCommentContainer.id = "comment-1-container";

	demoroot.appendChild(commentContainer);
	commentContainer.appendChild(topLevelCommentContainer);
	constructComment(topLevelCommentContainer);
	
	commentContainer.appendChild(replyCommentContainer);
	constructComment(replyCommentContainer);
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
		maxComment = 0;

		switch (ruleContext.type) {
			case "any":
			case "submission":
			case "gallery":
			case "link":
			case "poll":
			case "crosspost":
			case "text": {
				let postContainer = document.createElement("div");
				postContainer.classList.add("groupbox");
				postContainer.id = "post-container";
				demoroot.appendChild(postContainer);

				constructTitleArea(postContainer);
				constructBodyArea(postContainer);
				constructCommentArea(demoroot);
				
			}
			break;
			case "comment":
			{
				constructComment(demoroot);
			}
			break;
			
			
		}
		
		
		
		demoroot.appendChild(document.createElement("br"));
		demoroot.appendChild(document.createElement("br"));
		demoroot.appendChild(document.createElement("br"));
		demoroot.appendChild(document.createElement("br"));
	
		let outputContainer = document.createElement("div");
		let outputHeader = document.createElement("h4");
		let output = document.createElement("p");
	
		
		outputHeader.innerText = "Output: ";
		
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
	if (!searchMethod) throw "Unknown search method: " + modifiers;

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
 * @param {string} field 
 * @param {string} type
 * @returns {string[]}
 */
function mapFieldToForm(field, type) {
	switch(field) {
		case "body":
			let arr = new Array(maxComment).fill(0).map((val, idx) => ("comment-"+idx));
			if (!(type == "comment")) {
				arr.push("body");
			}
			return arr;

		default:
			return [field];
	}
}

/**
 * 
 * @param {RuleContext} ruleContext 
 */
function testRule(ruleContext) {
	let form = collectForm("demoform");

	for (let id of Object.keys(form)) {
		let e = document.getElementById(id + "-container");
		e.style.backgroundColor = "transparent";
	}

	let matchedElements = testSearchCheck(ruleContext, form);

	for (let id of matchedElements) {
		let e = document.getElementById(id + "-container");
		e.style.backgroundColor = "rgba(200 0 0 / 80%)";
	}
}

/**
 * 
 * @param {RuleContext} ruleContext 
 * @param {object} form 
 * @returns 
 */
function testSearchCheck(ruleContext, form) {
	let matchedElements = [];

	for (let field of ruleContext.searchCheck.fields) {
		let formElements = mapFieldToForm(field, currentType);
		for (let formElement of formElements) {
			if (Object.hasOwn(form, formElement)) {
				for (let value of ruleContext.searchCheck.values) {
					let regex = buildMatchRegex(value, ruleContext.searchCheck.modifiers);
					let result = regex.exec(form[formElement]);
					if (!ruleContext.searchCheck.isInverted){
						if (result) {
							matchedElements.push(formElement);
						}
					}
					else {
						if (!result) {
							matchedElements.push(formElement);
						}
					}
				}
			}
		}
	}
	return matchedElements;
}