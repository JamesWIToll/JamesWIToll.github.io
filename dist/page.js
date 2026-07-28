import { MenuBar } from "./components/MenuBar.js";
export class PageContent {
    constructor(id, display, selector) {
        this.id = id;
        this.display = display;
        this.selector = selector;
    }
    init() {
    }
}
export class Page {
    constructor(content) {
        this.content = content;
        this.menuBar = new MenuBar(this);
        content.forEach((item) => {
            this.menuBar.addMenuItem(item.id, item.display);
            item.init();
        });
        addEventListener("resize", (event) => {
            this.menuBar.updateContent();
        });
        this.selectedId = this.content[0].id;
        this.swapContent(this.selectedId);
    }
    swapContent(name) {
        $("#main-content").children().addClass("hidden-content").removeClass("shown-content");
        $("#menu-list-content").children().removeClass("selected");
        this.content.forEach((item) => {
            if (item.id == name) {
                $(item.selector).removeClass("hidden-content").addClass("shown-content");
                $("#menu-list-content").children("#" + item.id + "-menu-item").addClass("selected");
            }
        });
        this.selectedId = name;
    }
}
