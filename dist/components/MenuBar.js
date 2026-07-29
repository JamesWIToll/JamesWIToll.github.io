let viewportWidth = window.innerWidth;
export class MenuBar {
    constructor(page) {
        this.menuItems = new Map();
        console.log("here");
        this.page = page;
        this.updateContent();
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
        let content = $("#menu-list-content");
        content.empty();
        if (viewportWidth < 768) {
            content.append("<select name='menu-dropdown' id='menu-dropdown' class='btn'></select>");
        }
        this.menuItems.forEach((value, key) => {
            if (viewportWidth >= 768) {
                content.append("<div id='" + key + "-menu-item" + "' class='row'>" + value + "&nbsp;&nbsp;→</div>");
            }
            else {
                content.children("#menu-dropdown").append("<option id='" + key + "-menu-item" + "' value='" + key + "' class='col-2'>" + value + "</option>");
            }
            $("#" + key + "-menu-item").on("click", (e) => {
                this.page.swapContent(key);
                $("#menu-dropdown").val(value);
            });
        });
        $("#menu-dropdown").on("change", () => {
            this.page.swapContent($("#menu-dropdown").find("option:selected").prop("value"));
        });
        this.page.content.forEach(cont => {
            if (cont.id == this.page.selectedId) {
                $("#menu-dropdown").val(cont.id);
                content.children("#" + cont.id + "-menu-item").addClass("selected");
            }
        });
    }
}
