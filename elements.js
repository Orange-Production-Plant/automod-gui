class ChecklistElement extends HTMLLIElement {
	constructor() {
	  super();
	}

	connectedCallback() {

		this.classList.add("checklist-element");
		
		let id = this.id + "-" +  this.dataset.id
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

  

window.customElements.define("checklist-element",ChecklistElement,{extends:"li"})