import { chickenAnimations } from "../animations/chicken.anim.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { Coin } from "./coin.class.js";
import { Global } from "./global.class.js";
import { InputHandler } from "./inputHandler.class.js";
import { MovableObject } from "./movableObject.class.js";
import { World } from "./world.class.js";

export class Game extends World {
    constructor(global) {
        super();
        this.global = global;
        this.gameObjects = [];
        this.lastFrameTime = 0;
        this.gravity = 9.81;
        this.gravityEnabled = true;
        this.groundLevel = this.canvas.height - 50;
        this.cameraX = 0;
        this.keysPressed = { left: false, right: false };
        this.spawnCooldown = 2; // Sekunden zwischen dem Spawnen eines Gegners
        this.spawnCoinCooldown = 5; // Sekunden zwischen dem Spawnen eines Gegners
        this.lastEnemySpawnTime = 0; // Letzte Spawn-Zeit für Gegner
        this.minDistanceBetweenEnemies = 300; // Mindestabstand zwischen Gegnern
        this.spawnDistance = 350;
        this.lastCharacterX = 0;
        this.inputHandler = new InputHandler();
        this.coinSpacing = 50;
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    Start() {
        this.global = new Global();
        this.gameObjects.forEach(obj => {
            obj.global = this.global;
            obj.Start()
        });
        this.lastFrameTime = performance.now();
        this.Update();
    }

    Update() {
        if (this.global.gameOver) return;
        const currentFrameTime = performance.now();
        const deltaTime = (currentFrameTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameTime;
        this.ClearCanvas();
        this.renderBackgrounds();
        this.setSceneGameObjects(deltaTime);
        this.setSceneCamera(deltaTime);
        this.removeOffScreenEnemies();
        this.removeDeadCoins();
        requestAnimationFrame(() => this.Update());
    }

    updateCharacterMovement(deltaTime, character, input) {
        /*
        if(character.isHurt || character < 1) {
            character.velocity.x = 0;
            return;
        }*/
        if (input.right) {
            character.walk(true, 1, 100);
        }
        else if (input.left) {
            character.walk(false, -1, 100);
        }
        else {
            character.idle();
        }
        if (input.up) {
            character.jump();
        }

        character.move(deltaTime);
    }

    setSceneGameObjects(deltaTime) {
        this.gameObjects.forEach(obj => {
            obj.Start();
            if (this.gravityEnabled && obj instanceof MovableObject) obj.velocity.y += this.gravity * deltaTime;
            if (obj instanceof Chicken) obj.move(deltaTime, true);
            if (obj instanceof Character) {     // Kamera nur auf den Charakter fokussieren
                this.handleCameraAndCharacterMovement(obj, deltaTime);
                this.checkAndSpawnEnemy(obj);
                this.checkAndSpawnCoinRow(obj);
            }
            if (obj instanceof Character && obj.y + obj.height >= this.groundLevel) {   // Boden-Kollision für den Charakter
                obj.y = this.groundLevel - obj.height;
                obj.land();
            }
            obj.updateCollider();
        });
    }

    setSceneCamera(deltaTime) {
        this.gameObjects.forEach(obj => {
            let screenX;
            if (obj instanceof Character) {
                screenX = this.canvas.width / 2 - obj.width / 2;
            } else {
                screenX = obj.x - this.cameraX + this.canvas.width / 2;
            }
            obj.Update(this.ctx, deltaTime, screenX);
        });
    }
    


    handleCameraAndCharacterMovement(character, deltaTime) {
        if (character.health < 1 || character.isHurt) return;
        this.cameraX = character.x;
        const input = this.inputHandler.getInput();
        this.updateCharacterMovement(deltaTime, character, input);
    }

    setEnemyFacing(enemy, character) {
        if (character.velocity.x > 0) {
            enemy.facingRight = true;
            enemy.setTarget(character);  // Setzt das Ziel auf den Charakter
            enemy.player = character;
        }
        else {
            enemy.facingRight = false;
            enemy.setTarget(character);
            enemy.player = character;
        }
    }

    checkAndSpawnEnemy(character) {
        const currentFrameTime = performance.now() / 1000;
        if ((currentFrameTime - this.lastEnemySpawnTime >= this.spawnCooldown) &&
            Math.abs(character.x - this.lastCharacterX) >= this.spawnDistance) {
            const spawnX = character.x + (character.velocity.x > 0 ? this.spawnDistance : -this.spawnDistance);
            const enemy = new Chicken(spawnX, this.groundLevel - 50, 50, 50, chickenAnimations);
            enemy.global = this.global;
            this.setEnemyFacing(enemy, character);
            this.addGameObject(enemy);
            this.lastEnemySpawnTime = currentFrameTime;
            this.lastCharacterX = spawnX;
        }
    }

    checkAndSpawnCoinRow(character) {
        if(character.state == 'idle') return;
        const currentTime = performance.now() / 1000;
        //const minDistanceForNewRow = 500; // Mindestabstand zwischen Coin-Reihen
        const direction = character.facingRight ? 1 : -1;
    
        // Berechne die Startposition für die Coins: etwas außerhalb des sichtbaren Bereichs
        const startX = character.x + direction * (this.canvas.width / 2 + 100); // Spawnt Coins außerhalb des Canvas
        const yPosition = this.groundLevel - 80; // Feste Höhe der Coin-Reihe
    
        // Bedingung für Abklingzeit und Mindestabstand seit dem letzten Spawn
        if (currentTime - this.lastSpawnTime < this.spawnCoinCooldown) return;
        //if (Math.abs(character.x - this.lastCharacterX && this.spawnCooldown == 2) < minDistanceForNewRow) return;
    
        // Zufällige Anzahl von Coins erzeugen und in einer Linie platzieren
        const numberOfCoins = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < numberOfCoins; i++) {
            const x = startX + i * this.coinSpacing * direction; // Platzierung entlang der Bewegungsrichtung
            const coin = new Coin(x, yPosition, 80, 80, 10); // Größe und Punktewert der Coins
            coin.player = character;
            coin.global = this.global;
            this.addGameObject(coin);
        }
    
        // Aktualisiere die Zeit und Position des letzten Coin-Spawns
        this.lastSpawnTime = currentTime;
        this.lastCharacterX = character.x;
    }
    
    
    

    removeDeadCoins() {
        this.gameObjects = this.gameObjects.filter(obj => !(obj instanceof Coin && obj.dead));
    }

    removeOffScreenEnemies() {
        this.gameObjects = this.gameObjects.filter(obj => {
            if (obj instanceof Chicken) {
                // Entfernt Gegner, die außerhalb des Kamera-Sichtfelds sind
                const screenX = obj.x - this.cameraX + this.canvas.width / 2;
                return screenX + obj.width >= 0 && screenX <= this.canvas.width;
            }
            return true;
        });
    }

    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
