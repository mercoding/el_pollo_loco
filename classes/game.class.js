import { chickenBossAnimations } from "../animations/chickenBoss.anim.js";
import { enemyBossPositions, obstaclePositions } from "../js/gameObjectPositions.js";
import { checkAndSpawnEnemy } from "../js/spawnChicken.js";
import { checkAndSpawnCoinRow } from "../js/spawnCoins.js";
import { Cactus } from "./cactus.class.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { ChickenBoss } from "./chickenBoss.class.js";
import { Global } from "./global.class.js";
import { InputHandler } from "./inputHandler.class.js";
import { Obstacle } from "./obstacle.class.js";
import { Player } from "./player.class.js";
import { UI } from "./ui.class.js";
import { World } from "./world.class.js";

export class Game extends World {
    obstacles = [];
    collisionManager;
    constructor(global) {
        super();
        this.global = global;
        this.gameObjects = [];
        this.lastFrameTime = 0;
        this.groundLevel = this.canvas.height - 50;
        this.cameraX = 0;
        this.global = new Global();
        this.inGame = false;
        this.gameStarted = false;
        this.debug = false;
        this.inputHandler = new InputHandler();
        this.inputCooldown = 0.2;
        this.setSpawnSettings();
    }

    setSpawnSettings() {
        this.spawnCooldown = 2; // Sekunden zwischen dem Spawnen eines Gegners
        this.spawnCoinCooldown = 5; // Sekunden zwischen dem Spawnen eines Gegners
        this.lastEnemySpawnTime = 0; // Letzte Spawn-Zeit für Gegner
        this.minDistanceBetweenEnemies = 300; // Mindestabstand zwischen Gegnern
        this.spawnDistance = 350;
        this.lastCharacterX = 0;
        this.coinSpacing = 50;

        this.lastObstacleSpawnX = 0; // Track the X position of the last spawned obstacle
        this.minObstacleSpacing = 300; // Minimum distance between obstacles
        this.maxObstacleSpacing = 600; // Maximum distance between obstacles
        this.obstacleSpawnCooldown = 3; // Minimum time in seconds between spawns
        this.lastObstacleSpawnTime = 0;
    }


    setInGameUI() {
        this.ui.drawHealthBar(0, 50, 50);
        this.ui.menuActive = false;
        this.ui.onStart = false;
    }

    resetAudio() {
        this.global.audioManager.stopAll();
        if (this.global.getMusicOn()) this.global.audioManager.playMusic('El Pollo Loco');
        this.global.getVolumes();
    }

    StartGame() {
        if (this.ui.onStart && !this.global.inGame) return;
        this.global.reset();
        this.player = new Player(this.canvas, this.global);
        this.scrollSpeedClouds = 0.2;
        this.cloudsOffset = 0;
        this.setInGameUI();
        this.initializeObstacles();
        this.initializeBosses();
        this.cameraX = 0;
        this.resetAudio();
        this.inputHandler.deactivate();
        this.inputHandler.activate();
    }


    Start() {
        this.ui = new UI(this);
        this.lastFrameTime = performance.now();
        this.Update();
    }


    initializeBosses() {
        // Create obstacles at predefined positions to make them feel part of the scene
        const character = this.global.gameObjects.find(obj => obj instanceof Character);
        enemyBossPositions.forEach(positionX => {
            const boss = new ChickenBoss(chickenBossAnimations, this.global.collisionManager, character, positionX, this.groundLevel - 245, 250, 250, 'Enemy');
            boss.global = this.global;
            this.global.addGameObject(boss);
            this.global.collisionManager.addObject(boss);
        });
    }

    getObstacle(positionX, index) {
        let obstacle, ground, width;
        if (index % 3 === 0) {
            ground = this.groundLevel - 60;
            width = 45;
            obstacle = new Cactus('img/obstacles/cactus.png', this.global.collisionManager, positionX, ground, width, 60, 'Cactus');
        } else {
            ground = this.groundLevel - 30;
            width = 50;
            obstacle = new Obstacle('img/obstacles/stone.png', this.global.collisionManager, positionX, ground, width, 30, 'Obstacle');
        }
        return obstacle;
    }

    initializeObstacles() {
        obstaclePositions.forEach((positionX, index) => {
            const obstacle = this.getObstacle(positionX, index);
            obstacle.global = this.global;
            this.global.addGameObject(obstacle);
            this.global.collisionManager.addObject(obstacle);
        });
    }



    resume() {
        if (!this.global.pause && this.global.getMusicOn()) {
            this.global.audioManager.playMusic('El Pollo Loco');
            this.global.getVolumes();
        }
        else {
            this.global.setMusicOn(false);
            this.global.audioManager.stopMusic('El Pollo Loco');
        }
    }


    handleEscapeInput() {
        if (this.ui.menuActive) return;
        const input = this.inputHandler.getInput();
        if (input.esc && this.inputCooldown <= 0) {
            if (!this.inGame) this.ui.layer = 1;
            this.inputHandler.deactivate();
            this.togglePauseMenu();
            this.ui.toggleMenu();
            this.inputCooldown = 0.2;
            return;
        }
        if (!this.inputHandler.active)
            this.inputHandler.activate();
    }


    togglePauseMenu() {
        this.global.pause = !this.global.pause;
        this.inputHandler.setMenuActive(this.global.pause);
    }

    DeltaTime() {
        const currentFrameTime = performance.now();
        const frameRate = (currentFrameTime - this.lastFrameTime) / 1000;
        const maxDeltaTime = 1 / 30; // Begrenze auf 30 FPS
        const deltaTime = Math.min(frameRate, maxDeltaTime);
        this.lastFrameTime = currentFrameTime;
        this.inputCooldown = this.inputCooldown || 0; // Initialisieren, falls nicht vorhanden
        this.inputCooldown -= deltaTime;
        return deltaTime;
    }

    Update() {
        //this.handleEscapeInput();
        const deltaTime = this.DeltaTime();
        this.ClearCanvas();
        this.renderBackgrounds();
        this.UpdateGameObjects(deltaTime);
        this.setSceneGameObjects(deltaTime);
        this.drawUI();
        this.checkIfGameOver();
        this.ui.Update(deltaTime);
        this.removeOffScreenEnemies();
        this.global.collisionManager.Update(deltaTime);
        requestAnimationFrame(() => this.Update());
    }

    checkIfGameOver() {
        if (this.global.bossDefeated > 0 || this.global.health <= 0) {
            this.ui.drawGameOver();
        }
    }

    drawUI() {
        this.ui.drawBottleBar(this.global.getBottles(), 10, 10);
        this.ui.drawHealthBar(this.global.health, 10, 45);
        this.ui.drawCoinStatusBar(this.global.coins, 625, 10);
    }

    setSceneGameObjects(deltaTime) {
        this.global.gameObjects.forEach(obj => {
            if (obj instanceof Character) {     // Kamera nur auf den Charakter fokussieren
                checkAndSpawnEnemy(this, performance, obj);
                checkAndSpawnCoinRow(this, performance, obj);
            }
        });
    }

    UpdateGameObjects(deltaTime) {
        const character = this.global.gameObjects.find(obj => obj instanceof Character);
        if (this.player) this.player.Update(this.ctx, deltaTime);
        this.global.gameObjects.forEach(obj => {
            if (obj instanceof Character) {
                const screenX = this.cameraX = character.x - this.canvas.width / 2;
                if (typeof obj.Update === 'function') obj.Update(this.ctx, deltaTime, screenX);
                if (this.debug && typeof obj.drawCollider === 'function') obj.drawCollider(this.ctx, screenX);
            } else {
                const screenX = obj.x - this.cameraX;
                if (typeof obj.Update === 'function') obj.Update(this.ctx, deltaTime, screenX);
                if (this.debug && typeof obj.drawCollider === 'function') obj.drawCollider(this.ctx, this.cameraX);
            }
        });
    }


    removeOffScreenEnemies() {
        const character = this.global.gameObjects.find(player => player instanceof Character);
        const minDistanceToRemoveEnemy = 1000; // Mindeststrecke in Pixeln (anpassbar)
        this.global.gameObjects = this.global.gameObjects.filter(obj => {
            if (obj instanceof Chicken) {
                const screenX = obj.x - this.cameraX + this.canvas.width / 2;
                if (screenX + obj.width < 0 || screenX > this.canvas.width) {
                    const distanceMoved = Math.abs(character.x - obj.lastCharacterX);
                    if (distanceMoved >= minDistanceToRemoveEnemy) {
                        this.global.collisionManager.destroy(obj);
                        return false; // Entferne den Gegner
                    }
                }
                else obj.lastCharacterX = character.x;
            }
            return true; // Behalte das Objekt im Spiel, wenn es kein Chicken ist oder nicht entfernt werden soll
        });
    }


    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
