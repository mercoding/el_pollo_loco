import { World } from "./world.class.js";

export class UI extends World {
    healthStatusBar = new Image();
    bottlesStatusBar = new Image();
    bossStatusBar = new Image();
    coinsStatus = new Image();
    healthStatus = {
        0: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png'},
        20: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png'},
        40: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png'},
        60: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png'},
        80: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png'},
        100: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'}
    };

    bottleStatus = {
        0: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png'},
        20: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png'},
        40: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png'},
        60: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png'},
        80: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png'},
        100: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'}
    };

    constructor(global) {
        super();
        this.global = global;
        
    }


    Start() {

    }

    drawHealthBar(percent, x, y) {                
        this.healthStatusBar.src = this.healthStatus[percent].path;
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
        this.ctx.fillText(`${coins}`, x + 45, y + 35);        
    }
}