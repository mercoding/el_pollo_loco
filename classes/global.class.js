import { AudioManager } from "./AudioManager.class.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { ChickenBoss } from "./chickenBoss.class.js";
import { Coin } from "./coin.class.js";
import { CollisionManager } from "./collisionManager.class.js";
import { InputHandler } from "./inputHandler.class.js";

export class Global {
    constructor() {
        this.health = 100;
        this.bossDefeated = 0;
        this.bottles = 10;
        this.points = 0;
        this.coins = 0;
        this.inGame = false;
        this.gameOver = false;
        //this.isHurt = false;
        this.break = false;
        this.gameObjects = [];
        this.collisionManager = new CollisionManager();
        this.audioManager = new AudioManager();
        this.getVolumes();
        //this.audioManager.effectsVolume = 0.5;
        this.inputHandler = new InputHandler();
        this.pause = false;
        this.musicOn = true;
        this.groundLevel = 430;
        this.audioManager.loadSound('Explosion', 'audio/GGGrasslands - Box Destroy.wav');

    }

    getVolumes() {
        if(!localStorage.getItem('MusicOn')) this.setMusicOn('true');
        if(!localStorage.getItem('MusicVolume')) this.setMusicVolumes('0.5');
        if(!localStorage.getItem('SoundVolume')) this.setSoundVolumes('0.5');
        this.audioManager.musicOn = this.getMusicOn();
        this.audioManager.musicVolume = this.getMusicVolumes();
        this.audioManager.effectsVolume = this.getSoundVolumes();
    }

    getMusicOn() {
        return (localStorage.getItem('MusicOn') === 'true') ? true : false;
    }

    setMusicOn(value) {
        localStorage.setItem('MusicOn', value);
    }

    getMusicVolumes() {
        return parseFloat(localStorage.getItem('MusicVolume'));
    }

    setMusicVolumes(value) {
        localStorage.setItem('MusicVolume', value);
    }

    getSoundVolumes() {
        return parseFloat(localStorage.getItem('SoundVolume'));
    }

    setSoundVolumes(value) {
        localStorage.setItem('SoundVolume', value);
    }

    calculateBottlePercentage(bottleCount) {
        // Maximalanzahl der Flaschen
        const maxBottles = 10;

        // Berechne den Prozentsatz der aktuellen Flaschenanzahl
        const percentage = (bottleCount / maxBottles) * 100;

        // Runde auf den nächsten Schritt herunter, der in der UI-Anzeige verfügbar ist
        if (percentage >= 100) return 100;
        if (percentage >= 80) return 80;
        if (percentage >= 60) return 60;
        if (percentage >= 40) return 40;
        if (percentage >= 20) return 20;
        return 0;
    }

    updateCollisions() {
        this.collisionManager.updateCollisions();
    }

    getBottles() {
        return this.calculateBottlePercentage(this.bottles);
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    destroy(obj) { this.gameObjects = this.gameObjects.filter(o => o !== obj); }



    setGameStats() {
         // Zurücksetzen aller wichtigen Zustände
         this.health = 100;
         this.bottles = 10;
         this.points = 0;
         this.coins = 0;
         this.inGame = true;
         this.gameOver = false;
         this.bossDefeated = 0;
         this.pause = false;
         this.groundLevel = 430;
    }

    reset() {
        this.setGameStats();
        this.collisionManager.clear(); // Methode clear() sollte implementiert sein
        this.collisionManager = new CollisionManager();
        this.gameObjects.length = 0;
        this.gameObjects = [];
        this.audioManager.stopAll(); // Stopp alle Sounds und Musik
        this.audioManager = new AudioManager();
        this.audioManager.initializeUserInteractionListener();
        this.inputHandler.deactivate(); // Entfernt alle Event Listener
    }
    
}