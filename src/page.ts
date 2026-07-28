import {MenuBar} from "./components/MenuBar.js";

export class PageContent {
    id: string;
    display: string;
    selector: string;

    constructor(id: string, display: string, selector: string) {
        this.id = id;
        this.display = display;
        this.selector = selector;
    }

    init() : void {

    }
}

export class Page {

    menuBar : MenuBar;
    content : PageContent[];
    selectedId: string;

    constructor(content: PageContent[]) {
        this.content = content;
        this.menuBar = new MenuBar(this);

        content.forEach((item: PageContent) =>  {
            this.menuBar.addMenuItem(item.id, item.display);
            item.init();
        });

        addEventListener("resize", (event) => {
            this.menuBar.updateContent();
        });

        this.selectedId = this.content[0].id;
        this.swapContent(this.selectedId);
    }

    swapContent(name: string): void {
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
