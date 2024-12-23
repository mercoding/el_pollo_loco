import { chickenBossAnimations } from "../animations/chickenBoss.anim.js";
import { enemyBossPositions, obstaclePositions } from "../js/gameObjectPositions.js";
import { checkAndSpawnEnemy } from "../js/spawnChicken.js";
import { checkAndSpawnCoinRow } from "../js/spawnCoins.js";
import { Cactus } from "./cactus.class.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { ChickenBoss } from "./chickenBoss.class.js";
import { Global } from "./global.class.js";
import { Ground } from "./ground.class.js";
import { InputHandler } from "./inputHandler.class.js";
import { GameMenu } from "./Menu/gameMenu.class.js";
import { Obstacle } from "./obstacle.class.js";
import { Player } from "./player.class.js";
import { UI } from "./ui.class.js";
import { World } from "./world.class.js";

export class Game extends World {
    obstacles = [];
    collisionManager;
    constructor() {
        super();
        this.gameObjects = [];
        this.lastFrameTime = 0;
        this.cameraX = 0;
        this.global = new Global(this.canvas);
        this.inGame = false;
        this.gameStarted = false;
        this.debug = false;
        this.inputHandler = new InputHandler();
        this.inputCooldown = 0.2;
        this.setSpawnSettings();
    }

    /** Set spawn Settings for enemies and obstacles */
    setSpawnSettings() {
        this.spawnCooldown = 2; // Sekunden zwischen dem Spawnen eines Gegners
        this.spawnCoinCooldown = 5; // Sekunden zwischen dem Spawnen eines Gegners
        this.lastEnemySpawnTime = 0; // Letzte Spawn-Zeit für Gegner
        this.minDistanceBetweenEnemies = 300; // Mindestabstand zwischen Gegnern
        this.spawnDistance = 650;
        this.lastCharacterX = 0;
        this.coinSpacing = 50;
        this.lastObstacleSpawnX = 0; // Track the X position of the last spawned obstacle
        this.minObstacleSpacing = 300; // Minimum distance between obstacles
        this.maxObstacleSpacing = 600; // Maximum distance between obstacles
        this.obstacleSpawnCooldown = 3; // Minimum time in seconds between spawns
        this.lastObstacleSpawnTime = 0;
    }


    /** Start new game and reset all Game stats */
    StartGame() {
        this.global.reset();
        const ground = new Ground('', this.global.collisionManager, -20000, this.global.groundLevel, 40000, 50, 'Ground');
        this.global.addGameObject(ground);
        this.global.collisionManager.addObject(ground);
        this.player = new Player(this.canvas, this.global);
        this.initializeObstacles();
        this.initializeBosses();
        this.cameraX = 0;
        if (this.ui.global.getMusicOn()) this.ui.global.audioManager.playMusic('El Pollo Loco');
        this.inputHandler.deactivate();
        this.inputHandler.activate();
    }


    /** Start intro scene, menu and game loop called Update */
    Start() {
        this.ui = new UI(this);
        this.lastFrameTime = performance.now();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();

        if (this.hasTouchSupport()) {
            document.getElementById('title').style.display = "none";
            document.getElementById('fullscreen').style.display = "none";
        }

        this.Update();
    }


    /** Intialize Endbosses in both directions and spwan it to game scene */
    initializeBosses() {
        // Create obstacles at predefined positions to make them feel part of the scene
        const character = this.global.gameObjects.find(obj => obj instanceof Character);
        enemyBossPositions.forEach(positionX => {
            const boss = new ChickenBoss(chickenBossAnimations, this.global.collisionManager, character, positionX, this.global.groundLevel - 245, 250, 250, 'Enemy');
            boss.global = this.global;
            this.global.addGameObject(boss);
            this.global.collisionManager.addObject(boss);
        });
    }

    /**
     * Get obstracles a stone which character can land and a cactus
     *
     * @param {*} positionX
     * @param {*} index
     * @returns {*}
     */
    getObstacle(positionX, index) {
        let obstacle, ground, width;
        if (index % 3 === 0) {
            ground = this.global.groundLevel - 60;
            width = 45;
            obstacle = new Cactus('img/obstacles/cactus.png', this.global.collisionManager, positionX, ground, width, 60, 'Cactus');
        } else {
            ground = this.global.groundLevel - 30;
            width = 50;
            obstacle = new Obstacle('img/obstacles/stone.png', this.global.collisionManager, positionX, ground, width, 30, 'Obstacle');
        }
        return obstacle;
    }

    /** Spawn obstacles a stone and a cactus */
    initializeObstacles() {
        obstaclePositions.forEach((positionX, index) => {
            const obstacle = this.getObstacle(positionX, index);
            obstacle.global = this.global;
            this.global.addGameObject(obstacle);
            this.global.collisionManager.addObject(obstacle);
        });
    }


    /** Redraw function if user resize window or change to full screen */
    redrawGameObjects() {
        const deltaTime = this.DeltaTime();
        this.global.groundLevel = this.canvas.height * 0.87;
        this.global.gameObjects.forEach(obj => {
            if (obj.tag === "Ground") obj.y = this.global.groundLevel;
            if (obj.tag === "Player") obj.y = this.global.groundLevel;
            if (obj.tag === "Obstacle") obj.y = this.global.groundLevel - 30;
            if (obj.tag === "Cactus") obj.y = this.global.groundLevel - 60;
            if (obj instanceof ChickenBoss) obj.y = this.global.groundLevel - 245;
        });
        this.updateScene(deltaTime);
    }


    /**
     * Calculate delta time for game loop that all animation and moving works in a same perfomance
     *
     * @returns {*}
     */
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

    /**
     * Draw and update all scene objects in game loop
     *
     * @param {*} deltaTime
     */
    updateScene(deltaTime) {
        if (!this.global.inGame) return;
        this.setCamera();
        this.renderBackgrounds();
        this.UpdateGameObjects(deltaTime);
        this.setSceneGameObjects();
        this.drawUI();
        this.checkIfGameOver();
        this.removeOffScreenEnemies();
        this.global.collisionManager.Update(deltaTime);
        if (this.hasTouchSupport()) {
            this.checkOrientation();
        }
    }

    /** Update ui check orientation and update scene objects */
    Update() {
        const deltaTime = this.DeltaTime();
        this.ClearCanvas();
        this.updateScene(deltaTime);
        this.ui.Update(deltaTime);
        this.checkOrientation();
        requestAnimationFrame(() => this.Update());
    }


    /** Check if game over, has player won or lost */
    checkIfGameOver() {
        if (this.global.bossDefeated > 0 || this.global.health <= 0) {
            this.ui.drawGameOver();
            if(!this.ui.menuActive) setTimeout(() => {
                this.ui.menuActive = true;
                this.ui.global.pause = true;
                this.ui.global.audioManager.stopAll();
                this.ui.menu.changeMenu(new GameMenu(this.ui));
            }, 4000);
        }
    }

    /** Draw in game ui health, throwable bottles and coins */
    drawUI() {
        this.ui.drawBottleBar(this.global.getBottles(), 10, 10);
        this.ui.drawHealthBar(this.global.health, 10, 45);
        this.ui.drawCoinStatusBar(this.global.coins, this.canvas.width - 100, 10);
    }

    /** Spawn and set enemies or coins to scene */
    setSceneGameObjects() {
        this.global.gameObjects.forEach(obj => {
            if (obj instanceof Character) {     // Kamera nur auf den Charakter fokussieren
                checkAndSpawnEnemy(this, performance, obj);
                checkAndSpawnCoinRow(this, performance, obj);
            }
        });
    }

    /** Set Camera position which shows player always into the middle of canvas */
    setCamera() {
        const character = this.global.gameObjects.find(obj => obj instanceof Character);
        if (character === null) return;
        this.cameraX = character.x - this.canvas.width / 2;
    }

    /**
     * Update all game objects, positions, colliders and so on
     *
     * @param {*} deltaTime
     */
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


    /** Remove objects which are off screen  */
    removeOffScreenEnemies() {
        const charakter = this.global.gameObjects.find(player => player instanceof Character);
        const minDistanceToRemoveEnemy = 1000; // Mindeststrecke in Pixeln (anpassbar)
        this.global.gameObjects = this.global.gameObjects.filter(obj => {
            if (obj instanceof Chicken) {
                const screenX = obj.x - this.cameraX + this.canvas.width / 2;
                if (screenX + obj.width < 0 || screenX > this.canvas.width) {
                    const distanceMoved = Math.abs(charakter.x - obj.lastCharacterX);
                    if (distanceMoved >= minDistanceToRemoveEnemy) {
                        this.global.collisionManager.destroy(obj);
                        return false; // Entferne den Gegner
                    }
                }
                else obj.lastCharacterX = charakter.x;
            }
            return true; // Behalte das Objekt im Spiel, wenn es kein Chicken ist oder nicht entfernt werden soll
        });
    }


    /** Clear canvas */
    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    /** Resize canvas */
    resizeCanvas() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        document.getElementById('title').style.display = 'block';
        document.getElementById('fullscreen').style.display = 'block';
        if (!this.hasTouchSupport()) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.getElementById('title').style.display = 'none';
        document.getElementById('fullscreen').style.display = 'none';
        this.redrawGameObjects();
        if (this.player) {
            this.player.setTouchControls();
            this.player.checkIfOnMobile(this.ctx);
        }
    }


    /** Update ground level */
    updateGroundLevel() {
        this.global.groundLevel = this.canvas.height * 0.87;
        this.global.gameObjects.forEach(obj => {
            if (obj.tag === "Obstacle") obj.y = this.global.groundLevel - 30;
            if (obj.tag === "Cactus") obj.y = this.global.groundLevel - 60;
            if (obj.tag === "PLayer") obj.y = this.global.groundLevel - obj.height;
            if (obj.tag === "Enemy") obj.y = this.global.groundLevel - obj.height;
            if (obj.tag === "Ground") obj.y = this.global.groundLevel;
            if (obj.tag === "Coin") obj.y = this.global.groundLevel - 100;
        });
    }


    /** Check orientation for mobile devices */
    checkOrientation() {
        if (this.isPortrait() && this.hasTouchSupport()) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = (this.canvas.width > 430) ? '40px Arial' : '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(
                'Please rotate your device to play.',
                this.canvas.width / 2,
                this.canvas.height / 2
            );
        }
    }


    /**
     * Check if mobile device is in landscape
     *
     * @returns {*}
     */
    isLandscape() {
        return window.matchMedia("(orientation: landscape)").matches;
    }

    /**
     * Check if mobile device is in portrait
     *
     * @returns {*}
     */
    isPortrait() {
        return window.matchMedia("(orientation: portrait)").matches;
    }

    /**
     * Check if device has touch support
     *
     * @returns {boolean}
     */
    hasTouchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
}
