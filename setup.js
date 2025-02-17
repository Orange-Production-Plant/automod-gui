

/**
 * 
 * @param {SearchCheck} searchCheck 
 */
function addSearchCheckForm(searchCheck) {
	let container = document.getElementById("searchchecks");
	
	let check = document.createElement("search-check");
	check.dataset.index = container.dataset.n;
	container.dataset.n = parseInt(container.dataset.n) + 1;
	container.lastElementChild.before(check);
	check.setValue(searchCheck);
}





function buildSearchCheckForms(n) {
	let container = document.getElementById("searchchecks");

	if (container.dataset.n != n) {
		container.replaceChildren();
		container.dataset.n = n;
		for (let i = 0; i < n; i++) {
			let check = document.createElement("search-check");
			check.dataset.index = i;
			container.appendChild(check);
		}
	}

	let template = document.getElementById("scaddtemplate");
	container.appendChild(template.content.cloneNode(true));
	document.getElementById("addbutton").addEventListener("click", (ev)=>{
		let sc = new SearchCheck([], "includes-word", [], false, []);
		ruleContext.searchChecks.push(sc);
		addSearchCheckForm(sc);
	})
}

function removeSearchCheckForm(i) {
	let container = document.getElementById("searchchecks");
	container.children[i].remove();

	container.dataset.n -= 1;
}





function addContextListeners(ruleContext) {
	ruleContext.on("update", updateItemType);
	ruleContext.on("update", updateNME);
	ruleContext.on("update", updateSearchCheck);
	ruleContext.on("update", updateMiscChecks);

	ruleContext.on("update", updateActionForm);
	ruleContext.on("update", constructDemoArea);
	ruleContext.on("update", testRule);
}