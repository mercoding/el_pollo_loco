import { World } from "../world.class.js";

/**
 * Class which handle menu and game scene like a state machine
 *
 * @export
 * @class Menu
 * @typedef {Menu}
 * @extends {World}
 */
export class Menu extends World {
    constructor(currentMenu) {
        super();
        this.currentMenu = currentMenu;
    }

    /**
     * Change current state
     *
     * @param {*} newMenu
     */
    changeMenu(newMenu) {
        if (this.currentMenu && this.currentMenu.onExit) {
            this.currentMenu.onExit();
        }
        this.currentMenu = newMenu;
        if (this.currentMenu && this.currentMenu.onEnter) {
            this.currentMenu.onStart();
        }
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    Update(deltaTime) {
        if (this.currentMenu && this.currentMenu.onUpdate) {
            this.currentMenu.onUpdate(deltaTime);
        }    
    }
}