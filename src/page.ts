import {MenuBar} from "./components/MenuBar";

export class Page {

    menuBar : MenuBar;

    constructor() {
        this.menuBar = new MenuBar();

        addEventListener("resize", (event) => {
            this.menuBar.updateContent();
        });
    }

    swapContent(name: string): void {

    }
}