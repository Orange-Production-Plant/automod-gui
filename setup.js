


function buildSearchChecks(n) {
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