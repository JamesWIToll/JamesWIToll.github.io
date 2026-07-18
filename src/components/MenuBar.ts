let viewportWidth = window.innerWidth;

export class MenuBar  {

    menuItems: Map<string, string> = new Map<string, string>();

    removeMenuItem(id: string) {
        this.menuItems.delete(id);
        this.updateContent();
    }

    addMenuItem(id: string, value: string) {
        this.menuItems.set(id, value);
        this.updateContent();
    }

    updateContent(): void {
        viewportWidth = window.innerWidth;
        let menu_list = $("#menu-list");
        menu_list.empty();

        if (viewportWidth >= 768) {
            menu_list.append("hello");

        } else {

        }

    }
}