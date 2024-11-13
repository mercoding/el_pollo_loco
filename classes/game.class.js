import { chickenAnimations } from "../animations/chicken.anim.js";
import { chickenBossAnimations } from "../animations/chickenBoss.anim.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { ChickenBoss } from "./chickenBoss.class.js";
import { Coin } from "./coin.class.js";
import { Global } from "./global.class.js";
import { InputHandler } from "./inputHandler.class.js";
import { MovableObject } from "./movableObject.class.js";
import { Obstacle } from "./obstacle.class.js";
import { UI } from "./ui.class.js";
import { World } from "./world.class.js";

export class Game extends World {
    obstacles = [];
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

        this.lastObstacleSpawnX = 0; // Track the X position of the last spawned obstacle
        this.minObstacleSpacing = 300; // Minimum distance between obstacles
        this.maxObstacleSpacing = 600; // Maximum distance between obstacles
        this.obstacleSpawnCooldown = 3; // Minimum time in seconds between spawns
        this.lastObstacleSpawnTime = 0;
        this.ui = new UI(this.global);
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

        this.enemyBossPositions = [-10000, 10000];

        this.obstaclePositions = [
            -500,  // X position of the first obstacle
            -1000, // Second obstacle position
            -1500, // Continue adding obstacle positions as needed
            -2000,
            -3000,
            500,  // X position of the first obstacle
            1000, // Second obstacle position
            1500, // Continue adding obstacle positions as needed
            2000,
            3000,
            // etc.
        ];


        this.initializeObstacles();
        this.initializeBosses();
        this.ui.drawHealthBar(0,50,50);

        this.lastFrameTime = performance.now();
        this.Update();
    }

    initializeBosses() {
         // Create obstacles at predefined positions to make them feel part of the scene
         const character = this.gameObjects.find(obj => obj instanceof Character);
         this.enemyBossPositions.forEach(positionX => {
            const boss = new ChickenBoss(character, positionX, this.groundLevel - 245, 250, 250, chickenBossAnimations);
            boss.global = this.global;
            this.addGameObject(boss);
        });
    }

    initializeObstacles() {
        // Create obstacles at predefined positions to make them feel part of the scene
        this.obstaclePositions.forEach(positionX => {
            const obstacle = new Obstacle(positionX, this.groundLevel - 35, 35, 30, "img/obstacles/stone.png");
            this.addGameObject(obstacle);
        });
    }

    handleCollisions() {
        const character = this.gameObjects.find(obj => obj instanceof Character);
        this.gameObjects.forEach(obj => {
            if (obj instanceof Obstacle) {
                if (character.isCollidingWith(obj)) {
                    character.handleObstacleCollision(obj); // New collision method in Character
                }
            }
        });
    }

    Update() {
        if (this.global.gameOver) return;
        const currentFrameTime = performance.now();
        const deltaTime = (currentFrameTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameTime;
        this.ClearCanvas();
        this.renderBackgrounds();
        this.drawUI();
        this.setSceneGameObjects(deltaTime);
        this.setSceneCamera(deltaTime);
        this.removeOffScreenEnemies();
        // Regularly spawn obstacles
        this.handleCollisions();
        this.removeDeadCoins();
        requestAnimationFrame(() => this.Update());
    }
    


    drawUI() {
        this.ui.drawBottleBar(this.global.getBottles(), 10, 10);
        this.ui.drawHealthBar(this.global.health, 10, 45);
        this.ui.drawCoinStatusBar(this.global.coins, 625, 10);
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
            if (obj instanceof Chicken) {
                obj.move(deltaTime, true);
                this.gameObjects.forEach(obstacle => {
                    if (obstacle instanceof Obstacle) obstacle.handleCollisionWithEnemy(obj);
                });
            }
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
        if (character.global.health < 1 || character.isHurt) return;
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
        if(character.x > 9500 || character.x < -9500) return;
        const currentFrameTime = performance.now() / 1000;
        if ((currentFrameTime - this.lastEnemySpawnTime >= this.spawnCooldown) &&
            Math.abs(character.x - this.lastCharacterX) >= this.spawnDistance) {
            let spawnX = character.x + (character.velocity.x > 0 ? this.spawnDistance : -this.spawnDistance);

            spawnX = this.adjustCoinPosition(spawnX, this.obstaclePositions, 70);
            if (!this.isChickenNearby(spawnX, this.groundLevel - 50, 500)) {
                const enemy = new Chicken(spawnX, this.groundLevel - 50, 50, 50, chickenAnimations);
                enemy.global = this.global;
                this.setEnemyFacing(enemy, character);
                this.addGameObject(enemy);
                this.lastEnemySpawnTime = currentFrameTime;
                this.lastCharacterX = spawnX;
            }
        }
    }

    adjustCoinPosition(coinX, obstaclePositions, minDistance = 50) {
        // Funktion, die überprüft, ob die Position zu nah an den Hindernissen ist
        const isTooClose = (x) => obstaclePositions.some(obstacleX => Math.abs(obstacleX - x) < minDistance);

        // Verschiebe `coinX` in die passende Richtung abhängig von seinem Vorzeichen
        const shiftDirection = coinX < 0 ? -1 : 1; // Negativ für links, positiv für rechts

        // So lange die Münz-Position zu nah an einem Hindernis ist, verschieben
        while (isTooClose(coinX)) {
            coinX += shiftDirection * minDistance; // Münze um `minDistance` in die richtige Richtung verschieben
        }

        return coinX; // Gibt die angepasste Position zurück
    }

    isCoinNearby(x, y, threshold = 50) {
        // Prüfe, ob ein Coin in der Nähe der geplanten Position ist
        return this.gameObjects.some(obj => {
            return obj instanceof Coin &&
                Math.abs(obj.x - x) < threshold &&  // Horizontal in der Nähe
                Math.abs(obj.y - y) < threshold;    // Vertikal in der Nähe
        });
    }

    isChickenNearby(x, y, threshold = 100) {
        // Prüfe, ob ein Chicken in der Nähe der geplanten Position ist
        return this.gameObjects.some(obj => {
            return obj instanceof Chicken &&
                Math.abs(obj.x - x) < threshold &&  // Horizontal in der Nähe
                Math.abs(obj.y - y) < threshold;    // Vertikal in der Nähe
        });
    }



    checkAndSpawnCoinRow(character) {
        if (character.state === 'idle') return;
        const currentTime = performance.now() / 1000;
        const direction = character.facingRight ? 1 : -1;
    
        // Berechne die Startposition für die Coins, etwas außerhalb des sichtbaren Bereichs
        const startX = character.x + direction * (this.canvas.width / 2 + 100); // Spawnt Coins außerhalb des Canvas
        const baseYPosition = this.groundLevel - 80; // Basis-Höhe für die Coin-Reihe
    
        // Bedingung für Abklingzeit und Mindestabstand seit dem letzten Spawn
        if (currentTime - this.lastSpawnTime < this.spawnCoinCooldown) return;
    
        // Zufällige Entscheidung, ob die Coins in einer geraden Linie oder in einer gebogenen Reihe spawnen
        const isCurvedRow = Math.random() < 0.7; // 50% Wahrscheinlichkeit für eine gebogene Reihe
        const numberOfCoins = Math.floor(Math.random() * 6) + 3;
    
        for (let i = 0; i < numberOfCoins; i++) {
            let x = startX + i * this.coinSpacing * direction;
    
            // Berechne die Y-Position für die Coins
            let y;
            if (isCurvedRow) {
                // Startet unten und erreicht in der Mitte den höchsten Punkt
                const midpoint = Math.floor(numberOfCoins / 2);
                const curveHeight = 80; // Maximaler Höhenunterschied in der Kurve
                const distanceFromMidpoint = Math.abs(i - midpoint);
                y = baseYPosition - (curveHeight - distanceFromMidpoint * 20); // Wert 20 kontrolliert die Steigung zur Mitte hin
            } else {
                // Gerade Linie
                y = baseYPosition;
            }
    
            x = this.adjustCoinPosition(x, this.obstaclePositions, 50);
            if (!this.isCoinNearby(x, y, 80)) {
                const coin = new Coin(x, y, 80, 80, 1); // Größe und Punktewert der Coins
                coin.player = character;
                coin.global = this.global;
                this.addGameObject(coin);
            }
        }
    
        // Aktualisiere die Zeit und Position des letzten Coin-Spawns
        this.lastSpawnTime = currentTime;
        this.lastCharacterX = character.x;
    }
    
    


    // Prüft, ob ein Hindernis nahe der gewünschten Position ist
    isNearObstacle(x) {
        return this.gameObjects.some(obj => obj instanceof Obstacle && Math.abs(obj.x - x) < 100);
    }
   

    handleObjectCollisions(obj) {
        this.gameObjects.forEach(other => {
            if (other !== obj && other instanceof Obstacle) {
                if (obj.isCollidingWith(other)) {
                    if (obj instanceof Character) {
                        obj.handleObstacleCollision(other);  // New collision response in Character
                    }
                    else obj.resetAfterObstacle();
                    if (obj instanceof Chicken) {
                        other.handleCollisionWithEnemy(obj); // Obstacle changes Chicken direction
                    }
                }
            }
        });
    }



    removeDeadCoins() {
        this.gameObjects = this.gameObjects.filter(obj => !(obj instanceof Coin && obj.dead));
    }

    removeOffScreenEnemies() {
        const character = this.gameObjects.find(player => player instanceof Character);
        // Definiere die Mindestentfernung, die der Charakter in die entgegengesetzte Richtung laufen muss, um einen Gegner zu löschen
        const minDistanceToRemoveEnemy = 1000; // Mindeststrecke in Pixeln (anpassbar)

        this.gameObjects = this.gameObjects.filter(obj => {
            if (obj instanceof Chicken) {
                // Berechne die Position des Gegners relativ zur Kamera
                const screenX = obj.x - this.cameraX + this.canvas.width / 2;

                // Wenn der Gegner außerhalb des Kamera-Sichtfelds ist
                if (screenX + obj.width < 0 || screenX > this.canvas.width) {
                    // Prüfe, ob der Charakter genügend Abstand zurückgelegt hat
                    const distanceMoved = Math.abs(character.x - obj.lastCharacterX);

                    if (distanceMoved >= minDistanceToRemoveEnemy) {
                        return false; // Entferne den Gegner
                    }
                } else {
                    // Aktualisiere die letzte bekannte Position des Charakters, wenn der Gegner im Sichtfeld ist
                    obj.lastCharacterX = character.x;
                }
            }
            return true; // Behalte das Objekt im Spiel, wenn es kein Chicken ist oder nicht entfernt werden soll
        });
    }


    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}
