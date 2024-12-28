import { AudioManager } from "./AudioManager.class.js";
import { CollisionManager } from "./collisionManager.class.js";
import { InputHandler } from "./inputHandler.class.js";

/**
 * Global class all variables for game handling and game play
 * reset all stats on start or restart
 *
 * @export
 * @class Global
 * @typedef {Global}
 */
export class Global {
    constructor(canvas) {
        this.canvas = canvas;
        this.inGame = false;
        this.gameOver = false;
        this.break = false;
        this.gameObjects = [];
        this.collisionManager = new CollisionManager();
        this.audioManager = new AudioManager();
        this.getVolumes();
        this.inputHandler = new InputHandler();
        this.pause = false;
        this.musicOn = true;
        this.groundLevel = this.canvas.height * 0.87;
        this.audioManager.loadSound('Explosion', 'audio/GGGrasslands - Box Destroy.wav');
    }

    /** Get game Volumes -> music, sound */
    getVolumes() {
        if(!localStorage.getItem('MusicOn')) this.setMusicOn('true');
        if(!localStorage.getItem('MusicVolume')) this.setMusicVolumes('0.5');
        if(!localStorage.getItem('SoundVolume')) this.setSoundVolumes('0.5');
        this.audioManager.musicOn = this.getMusicOn();
        this.audioManager.musicVolume = this.getMusicVolumes();
        this.audioManager.effectsVolume = this.getSoundVolumes();
    }

    /**
     * Get music status
     *
     * @returns {boolean}
     */
    getMusicOn() {
        return (localStorage.getItem('MusicOn') === 'true') ? true : false;
    }

    /**
     * Set music on or off
     *
     * @param {*} value
     */
    setMusicOn(value) {
        localStorage.setItem('MusicOn', value);
    }

    /**
     * Get music volume
     *
     * @returns {*}
     */
    getMusicVolumes() {
        return parseFloat(localStorage.getItem('MusicVolume'));
    }

    /**
     * Set music volume
     *
     * @param {*} value
     */
    setMusicVolumes(value) {
        localStorage.setItem('MusicVolume', value);
    }

    /**
     * Get sound volume
     *
     * @returns {*}
     */
    getSoundVolumes() {
        return parseFloat(localStorage.getItem('SoundVolume'));
    }

    /**
     * Set sound volume
     *
     * @param {*} value
     */
    setSoundVolumes(value) {
        localStorage.setItem('SoundVolume', value);
    }

    /**
     * Calculate bottle count into percentage for in game ui
     *
     * @param {*} bottleCount
     * @returns {(100 | 90 | 80 | 70 | 60 | 50 | 40 | 30 | 20 | 10 | 0)}
     */
    calculateBottlePercentage(bottleCount) {
        const maxBottles = 10;
        const percentage = (bottleCount / maxBottles) * 100;
        return percentage;
    }

    /** Update collision manager */
    updateCollisions() {
        this.collisionManager.updateCollisions();
    }

    /**
     * Get bottles percentage
     *
     * @returns {(0 | 100 | 80 | 60 | 40 | 20)}
     */
    getBottles() {
        return this.calculateBottlePercentage(this.bottles);
    }

    /**
     * Add game object into game object list
     *
     * @param {*} gameObject
     */
    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    /**
     * Destroy game object from game object list
     *
     * @param {*} obj
     */
    destroy(obj) { this.gameObjects = this.gameObjects.filter(o => o !== obj); }



    /** Set game stats */
    setGameStats() {
         // Zurücksetzen aller wichtigen Zustände
         this.health = 100;
         this.bottles = 10;
         this.points = 0;
         this.coins = 0;
         this.inGame = true;
         this.gameOver = false;
         this.timerOff = false;
         this.bossDefeated = 0;
         this.pause = false;
         this.groundLevel = this.canvas.height * 0.87;
    }

    /** Reset all game stats */
    reset() {
        this.setGameStats();
        this.collisionManager.clear(); // Methode clear() sollte implementiert sein
        this.collisionManager = new CollisionManager();
        this.gameObjects.length = 0;
        this.gameObjects = [];
        this.audioManager.stopAll(); // Stopp alle Sounds und Musik
        this.audioManager = new AudioManager();
        this.audioManager.musicVolume = this.getMusicVolumes();
        this.audioManager.effectsVolume = this.getSoundVolumes();
        this.audioManager.initializeUserInteractionListener();
        this.inputHandler.deactivate(); // Entfernt alle Event Listener
        clearInterval();
        clearTimeout();
    }
    
}