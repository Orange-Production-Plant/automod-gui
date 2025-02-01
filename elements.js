class ChecklistElement extends HTMLLIElement {
	constructor() {
	  super();
	}

	connectedCallback() {
		this.classList.add("checklist-element");
		
		let id = this.parentElement.id + "-" +  this.dataset.value
		let checkbox = document.createElement("input");
	
		checkbox.type = "checkbox";
		checkbox.id = id;
		checkbox.name = id;
		checkbox.classList.add("checklist-button");
		checkbox.dataset.value = this.dataset.value;
		checkbox.dataset.container = this.parentElement.id;

		if (this.parentElement.dataset.form) {
			checkbox.setAttribute("form", this.parentElement.dataset.form);
		}
		

		let label = document.createElement("label");
		label.htmlFor = id;
		label.classList.add("checklist-label")
		label.innerText = this.innerText;
		
		this.innerHTML = "";
		this.appendChild(checkbox);
		this.appendChild(label);
	}
}

class RadiolistElement extends HTMLLIElement {
	constructor() {
	  super();
	}

	connectedCallback() {
		this.classList.add("checklist-element");
		
		let id = this.parentElement.id + "-" +  this.dataset.value
		let radiobutton = document.createElement("input");
	
		radiobutton.type = "radio";
		radiobutton.id = id;
		radiobutton.name = this.parentElement.id + "-radio";
		radiobutton.value = this.dataset.value;
		radiobutton.classList.add("checklist-button");
		
		let label = document.createElement("label");
		label.htmlFor = id;
		label.classList.add("checklist-label")
		label.innerText = this.innerText;
		
		this.innerHTML = "";
		this.appendChild(radiobutton);
		this.appendChild(label);
	}
} 

class Checklist extends HTMLUListElement {
	constructor() {
	  super();
	}

	connectedCallback() {
		this.classList.add("checklist")
		
		let list = this.dataset.list;

		let entries;
		if (!Object.hasOwn(valueObjects, list)) {
			entries = Object.entries({"error":"Error reading list " + list})
		}
		else {
			entries = Object.entries(valueObjects[list])
		}

		let lastLi;
		for (let entry of entries) {
			const value = entry[0];
			const labelText = entry[1];

			let li = new ChecklistElement();

			li.dataset.value = value;
			li.innerText = labelText;

			if (this.dataset.form) {
				li.dataset.form = form;
			}

			this.appendChild(li);
			lastLi = li;
		}
		lastLi.style.marginBottom = 0;
	}
} 


class Dropdown extends HTMLSelectElement {
	constructor() {
	  super();
	}

	connectedCallback() {
		this.classList.add("checklist")
		
		let list = this.dataset.list;

		let entries;
		if (!Object.hasOwn(valueObjects, list)) {
			entries = Object.entries({"error":"Error reading list " + list})
		}
		else {
			entries = Object.entries(valueObjects[list])
		}

		for (let entry of entries) {
			const value = entry[0];
			const labelText = entry[1];
	
			let option = document.createElement("option");
	
			option.value = value;
			option.innerText = labelText;
	
			this.appendChild(option);
		}
	}
}
/**
 * 
 * @param {any[]} list 
 * @param {object} obj 
 * @returns {any[]}
 */
function objHasTrueKeys(list, obj) {
	let ret = [];
	for (let val of list) {
		if (obj[val]) {
			ret.push(val);
		}
	}
	return ret;
}
let temp1;

class SearchCheckElement extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		/**
		 * @type {HTMLTemplateElement} 
		 */
		let template = document.getElementById("sctemplate");

		const shadowRoot = this.attachShadow({mode:"open"});
		shadowRoot.appendChild(template.content.cloneNode(true));
		temp1 = this;
	}

	getValue() {
		/**
		 * @type {HTMLFormElement}
		 */
		let form = this.shadowRoot.getElementById("searchcheck");
		
		let formObject = collectForm(form);

		return new SearchCheck(objHasTrueKeys(Object.keys(searchFields), formObject.fields), objHasTrueKeys(Object.keys(searchModifiers), formObject.fields).concat([formObject.searchmethod]), formObject.invert.invert, [formObject.fieldmatch])
	}
}



window.customElements.define("checklist-element", ChecklistElement, {extends:"li"})
window.customElements.define("radiolist-element", RadiolistElement, {extends:"li"})
window.customElements.define("check-list", Checklist, {extends:"ul"});
window.customElements.define("drop-down", Dropdown, {extends: "select"})
window.customElements.define("search-check", SearchCheckElement);