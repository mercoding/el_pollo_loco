import { InputHandler } from "./inputHandler.class.js";
import { InfoMenu } from "./Menu/infoMenu.class.js";
import { Intro } from "./Menu/intro.class.js";
import { Menu } from "./Menu/menu.class.js";
import { StartMenu } from "./Menu/startMenu.class.js";
import { World } from "./world.class.js";

/**
 * Class which draw UI like health, bottle bar and coins
 *
 * @export
 * @class UI
 * @typedef {UI}
 * @extends {World}
 */
export class UI extends World {
    startBackground = new Image();
    startMenuBackground = new Image();
    healthStatusBar = new Image();
    bottlesStatusBar = new Image();
    bossStatusBar = new Image();
    coinsStatus = new Image();
    gameOverImg = new Image();
    gameWinImg = new Image();
    healthStatus = {
        0: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png' },
        20: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png' },
        40: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png' },
        60: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png' },
        80: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png' },
        100: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png' }
    };

    bottleStatus = {
        0: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png' },
        10: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/10.png' },
        20: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png' },
        30: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/30.png' },
        40: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png' },
        50: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/50.png' },
        60: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png' },
        70: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/70.png' },
        80: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png' },
        90: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/90.png' },
        100: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png' }
    };

    constructor(game) {
        super(game);
        this.game = game;
        this.menuActive = false; 
        this.intro = true;
        this.global = game.global;
        this.global.inGame = false;
        this.global.pause = true;
        this.selectedOption = 0;
        this.menu = new Menu(new InfoMenu(this));
        this.Start();
    }

    preloadImages(images) {
        // Iteriere durch die Keys des Objekts
        for (const key in images) {
            if (images.hasOwnProperty(key)) {
                const img = new Image(); // Erstelle ein neues Image-Objekt
                img.src = images[key].path; // Weise den Bildpfad zu
                images[key].image = img; // Speichere das geladene Bild im Objekt
            }
        }
        return images; // Gib das aktualisierte Objekt zurück
    }

    /** Set stuff on start */
    Start() {
        this.global.getVolumes();
        this.bottleImages = this.preloadImages(this.bottleStatus);
        this.healthImages = this.preloadImages(this.healthStatus);
        this.gameOverImg.src = "img/9_intro_outro_screens/game_over/you lost.png";
        this.gameWinImg.src = "img/9_intro_outro_screens/win/won_1.png";
        this.coinsStatus.src = 'img/7_statusbars/3_icons/icon_coin.png';
    }

    /**
     * Update ui state machine if state intro it shows intro scene to example
     * on state canceledMenu it starts game and over watch p key to change into
     * in game menu state
     *
     * @param {*} deltaTime
     */
    Update(deltaTime) {
        this.menu.Update(deltaTime);
    }


    /**
     * Description placeholder
     *
     * @param {*} percent
     * @param {*} x
     * @param {*} y
     */
    drawHealthBar(percent, x, y) {        
        this.healthStatusBar = percent > 0 ? this.healthImages[percent].image : this.healthImages[0].image; //this.healthStatus['0'].path;
        this.ctx.drawImage(this.healthStatusBar, x, y, 200, 50);
    }


    /**
     * Draw bottle bar in game ui
     *
     * @param {*} percent
     * @param {*} x
     * @param {*} y
     */
    drawBottleBar(percent, x, y) {
        this.bottlesStatusBar = this.bottleImages[percent].image;
        this.ctx.drawImage(this.bottlesStatusBar, x, y, 200, 50);
    }

    /**
     * Draw coin status in game ui
     *
     * @param {*} coins
     * @param {*} x
     * @param {*} y
     */
    drawCoinStatusBar(coins, x, y) {
        this.ctx.drawImage(this.coinsStatus, x, y, 50, 50);
        this.ctx.font = '30px "Boogaloo"';
        this.ctx.fillStyle = 'white'; //
        const tx = x > 99 ? x + 5 : x;
        this.ctx.fillText(`${coins}`, x + 55, y + 35);
    }


    /** Draw game over image */
    drawGameOver() {
        const gameOver = this.global.health <= 0 ? this.gameOverImg : this.gameWinImg;
        if (this.global.health <= 0) this.ctx.drawImage(gameOver, 0, 0, this.canvas.width, this.canvas.height);
        else this.ctx.drawImage(gameOver, this.canvas.width / 2 - 200, this.canvas.height / 2 - 75, 400, 150);
        this.global.gameOver = true;
    }


    /** Clear canvas */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}