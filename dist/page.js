import { MenuBar } from "./components/MenuBar";
export class Page {
    constructor() {
        this.menuBar = new MenuBar();
        addEventListener("resize", (event) => {
            this.menuBar.updateContent();
        });
    }
    swapContent(name) {
    }
}
