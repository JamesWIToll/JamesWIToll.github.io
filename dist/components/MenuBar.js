let viewportWidth = window.innerWidth;
export class MenuBar {
    constructor() {
        this.menuItems = new Map();
    }
    removeMenuItem(id) {
        this.menuItems.delete(id);
        this.updateContent();
    }
    addMenuItem(id, value) {
        this.menuItems.set(id, value);
        this.updateContent();
    }
    updateContent() {
        viewportWidth = window.innerWidth;
        let menu_list = $("#menu-list");
        menu_list.empty();
        if (viewportWidth >= 768) {
            menu_list.append("hello");
        }
        else {
        }
    }
}
