import { InputHandler } from "./inputHandler.class.js";
import { Intro } from "./Menu/intro.class.js";
import { Menu } from "./Menu/menu.class.js";
import { World } from "./world.class.js";

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
        20: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png' },
        40: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png' },
        60: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png' },
        80: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png' },
        100: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png' }
    };

    constructor(game) {
        super(game);
        this.game = game;
        this.menuActive = false; // Menü ist zunächst deaktiviert
        this.intro = true;
        this.global = game.global;
        this.global.inGame = false;
        this.global.pause = true;
        this.selectedOption = 0;
        this.menu = new Menu(new Intro(this));
        this.Start();
    }


    Start() {
        this.global.getVolumes();
        this.gameOverImg.src = "img/9_intro_outro_screens/game_over/you lost.png";
        this.gameWinImg.src = "img/9_intro_outro_screens/win/won_1.png";
    }

    Update(deltaTime) {
        this.menu.Update(deltaTime);
    }


    drawHealthBar(percent, x, y) {
        this.healthStatusBar.src = percent > 0 ? this.healthStatus[percent].path : this.healthStatus['0'].path;
        this.ctx.drawImage(this.healthStatusBar, x, y, 200, 50);
    }


    drawBottleBar(percent, x, y) {
        this.bottlesStatusBar.src = this.bottleStatus[percent].path;
        this.ctx.drawImage(this.bottlesStatusBar, x, y, 200, 50);
    }

    drawCoinStatusBar(coins, x, y) {
        this.coinsStatus.src = 'img/7_statusbars/3_icons/icon_coin.png';
        this.ctx.drawImage(this.coinsStatus, x, y, 50, 50);
        this.ctx.font = '30px "Boogaloo"';
        this.ctx.fillStyle = 'white'; //
        const tx = x > 99 ? x + 5 : x;
        this.ctx.fillText(`${coins}`, x + 55, y + 35);
    }


    drawGameOver() {
        const gameOver = this.global.health <= 0 ? this.gameOverImg : this.gameWinImg;
        if (this.global.health <= 0) this.ctx.drawImage(gameOver, 0, 0, this.canvas.width, this.canvas.height);
        else this.ctx.drawImage(gameOver, this.canvas.width / 2 - 200, this.canvas.height / 2 - 75, 400, 150);
        this.global.gameOver = true;
    }


    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}