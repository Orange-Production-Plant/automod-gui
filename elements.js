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


window.customElements.define("checklist-element",ChecklistElement,{extends:"li"})
window.customElements.define("radiolist-element",RadiolistElement,{extends:"li"})