export class MenuBar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = "<b style='color: white;'>hello</b>"
    }
}

customElements.define("menu-bar", MenuBar);