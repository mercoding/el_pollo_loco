import { Character } from "./character.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameObjects = [];
        this.lastFrameTime = 0;
        this.gravity = 9.81;
        this.gravityEnabled = true;
        this.groundLevel = this.canvas.height - 50;

        // Parallax-Hintergrundbilder
        this.backgroundImageSky = new Image();
        this.backgroundImageSky.src = 'img/5_background/layers/air.png';
        this.backgroundImageMountains = new Image();
        this.backgroundImageMountains.src = 'img/5_background/layers/3_third_layer/full.png';
        this.backgroundImageFar = new Image();
        this.backgroundImageFar.src = 'img/5_background/layers/2_second_layer/full.png';
        this.backgroundImageNear = new Image();
        this.backgroundImageNear.src = 'img/5_background/layers/1_first_layer/full.png';

        this.scrollSpeedFar = 0.5;  // Langsamer für hinteren Hintergrund
        this.scrollSpeedNear = 1.0; // Schneller für vorderen Hintergrund

        // Kamera-Position und Character-Position
        this.cameraX = 0;
        this.keysPressed = { left: false, right: false };

        //this.initInputListeners();
    }
/*
    initInputListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.keysPressed.right = true;
            if (e.key === 'ArrowLeft') this.keysPressed.left = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight') this.keysPressed.right = false;
            if (e.key === 'ArrowLeft') this.keysPressed.left = false;
        });
    }*/

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    Start() {
        this.gameObjects.forEach(obj => obj.Start());
        this.lastFrameTime = performance.now();
        this.Update();
    }

    Update() {
        const currentFrameTime = performance.now();
        const deltaTime = (currentFrameTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameTime;

        this.ClearCanvas();
        this.renderBackgrounds();

        // Spiellogik und Zeichnen der Spielobjekte
        this.gameObjects.forEach(obj => {
            if (this.gravityEnabled && obj instanceof MovableObject) {
                obj.velocity.y += this.gravity * deltaTime;
            }

            obj.move(deltaTime);
            obj.updateCollider();

            // Kollision mit Boden
            if (obj instanceof Character && obj.y + obj.height >= this.groundLevel) {
                obj.y = this.groundLevel - obj.height;
                obj.land();
            }

            // Kamera-Bewegung basierend auf Charakterposition
            if (obj instanceof Character) {
                this.handleCameraAndCharacterMovement(obj, deltaTime);
            }
        });

        // Zeichne den Charakter immer in der Bildschirmmitte (screenX = canvas.width / 2)
        this.gameObjects.forEach(obj => {
            const screenX = this.canvas.width / 2 - obj.width / 2;
            obj.Update(this.ctx, deltaTime, screenX);
        });

        requestAnimationFrame(() => this.Update());
    }

    handleCameraAndCharacterMovement(character, deltaTime) {
        // Kamera folgt dem Charakter
        this.cameraX = character.x;

        // Steuerung für Charakterbewegung
        character.keyPressed = true;
        if (this.keysPressed.right) {
            character.velocity.x = 100;  // Rechts laufen
        } else if (this.keysPressed.left) {
            character.velocity.x = -100; // Links laufen
        } else {
            character.velocity.x = 0;    // Stoppen
            character.keyPressed = false;
        }
    }

    renderBackgrounds() {
        // Berechnung der Parallax-Hintergründe basierend auf der Kamera-Position
        const mountainX = -(this.cameraX * this.scrollSpeedFar) / 4 % this.canvas.width;
        const farX = -(this.cameraX * this.scrollSpeedFar) % this.canvas.width;
        const nearX = -(this.cameraX * this.scrollSpeedNear) % this.canvas.width;

        this.ctx.drawImage(this.backgroundImageSky, 0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.backgroundImageMountains, mountainX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageMountains, mountainX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (mountainX > 0) {
            this.ctx.drawImage(this.backgroundImageMountains, mountainX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }

        // Hinterer Hintergrund
        this.ctx.drawImage(this.backgroundImageFar, farX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageFar, farX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (farX > 0) {
            this.ctx.drawImage(this.backgroundImageFar, farX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }

        // Vorderer Hintergrund
        this.ctx.drawImage(this.backgroundImageNear, nearX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageNear, nearX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (nearX > 0) {
            this.ctx.drawImage(this.backgroundImageNear, nearX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }
    }

    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
