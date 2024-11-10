import { chickenAnimations } from "../animations/chicken.anim.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { Global } from "./global.class.js";
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
        this.lastEnemySpawnTime = 0; // Letzte Spawn-Zeit für Gegner
        this.minDistanceBetweenEnemies = 300; // Mindestabstand zwischen Gegnern
        this.spawnDistance = 350;
        this.lastCharacterX = 0;
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
        requestAnimationFrame(() => this.Update());
    }

    setSceneGameObjects(deltaTime) {
        this.gameObjects.forEach(obj => {
            if (this.gravityEnabled && obj instanceof MovableObject) obj.velocity.y += this.gravity * deltaTime;
            if (obj instanceof Chicken) obj.move(deltaTime, true);
            if (obj instanceof Character && !this.global.isHust) obj.move(deltaTime);
            obj.updateCollider();
            if (obj instanceof Character && obj.y + obj.height >= this.groundLevel) {   // Boden-Kollision für den Charakter
                obj.y = this.groundLevel - obj.height;
                obj.land();
            }
            if (obj instanceof Character) {     // Kamera nur auf den Charakter fokussieren
                this.handleCameraAndCharacterMovement(obj, deltaTime);
                this.checkAndSpawnEnemy(obj);
            }
        });
    }

    setSceneCamera(deltaTime) {
        // Zeichne alle Objekte relativ zur Kamera
        this.gameObjects.forEach(obj => {
            let screenX;
            // Falls es der Charakter ist, bleibt er in der Mitte
            if (obj instanceof Character) {
                screenX = this.canvas.width / 2 - obj.width / 2;
            } else {
                // Für andere Objekte die relative Position zur Kamera berechnen
                screenX = obj.x - this.cameraX + this.canvas.width / 2;
            }
            obj.Update(this.ctx, deltaTime, screenX);
        });
    }


    handleCameraAndCharacterMovement(character, deltaTime) {
        if (character.health < 1) return;
        this.cameraX = character.x;
        character.keyPressed = true;
        if (this.keysPressed.right) character.velocity.x = 100;
        else if (this.keysPressed.left) character.velocity.x = -100;
        else {
            character.velocity.x = 0;
            character.keyPressed = false;
        }
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
            this.setEnemyFacing(enemy, character);
            this.addGameObject(enemy);
            this.lastEnemySpawnTime = currentFrameTime;
            this.lastCharacterX = spawnX;
        }
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
