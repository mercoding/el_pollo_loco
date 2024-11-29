import { World } from "../world.class.js";

export class Menu extends World {
    constructor(currentMenu) {
        super();
        this.currentMenu = currentMenu;
    }

    changeMenu(newMenu) {
        if (this.currentMenu && this.currentMenu.onExit) {
            this.currentMenu.onExit();
        }
        this.currentMenu = newMenu;
        if (this.currentMenu && this.currentMenu.onEnter) {
            this.currentMenu.onStart();
        }
    }

    Update(deltaTime) {
        if (this.currentMenu && this.currentMenu.onUpdate) {
            this.currentMenu.onUpdate(deltaTime);
        }        
    }
}