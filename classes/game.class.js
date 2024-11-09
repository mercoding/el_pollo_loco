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
        this.backgroundImageClouds = new Image();
        this.backgroundImageClouds.src = 'img/5_background/layers/4_clouds/full.png';
        this.backgroundImageMountains = new Image();
        this.backgroundImageMountains.src = 'img/5_background/layers/3_third_layer/full.png';
        this.backgroundImageFar = new Image();
        this.backgroundImageFar.src = 'img/5_background/layers/2_second_layer/full.png';
        this.backgroundImageNear = new Image();
        this.backgroundImageNear.src = 'img/5_background/layers/1_first_layer/full.png';

        // Scroll-Geschwindigkeiten
        this.scrollSpeedClouds = 0.2;    // Langsame Geschwindigkeit für die kontinuierliche Bewegung der Wolken
        this.scrollSpeedMountains = 0.4; // Geschwindigkeit für die Berge
        this.scrollSpeedFar = 0.5;       // Geschwindigkeit für den fernen Hintergrund
        this.scrollSpeedNear = 1.0;      // Geschwindigkeit für den vorderen Hintergrund

        // Initialpositionen für die Wolken
        this.cloudsOffset = 0;

        // Kamera-Position und Eingaben
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

            // Boden-Kollision
            if (obj instanceof Character && obj.y + obj.height >= this.groundLevel) {
                obj.y = this.groundLevel - obj.height;
                obj.land();
            }

            // Kamera-Steuerung
            if (obj instanceof Character) {
                this.handleCameraAndCharacterMovement(obj, deltaTime);
            }
        });

        // Zeichne den Charakter in der Mitte
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
            character.velocity.x = 100;
        } else if (this.keysPressed.left) {
            character.velocity.x = -100;
        } else {
            character.velocity.x = 0;
            character.keyPressed = false;
        }
    }

    renderBackgrounds() {
        // Verschiebt die Wolken nach links für eine kontinuierliche Bewegung
        this.cloudsOffset -= this.scrollSpeedClouds;

        // X-Positionen basierend auf der Kamera-Position und Scroll-Geschwindigkeiten
        const cloudsX = this.cloudsOffset % this.canvas.width;
        const mountainX = -(this.cameraX * this.scrollSpeedMountains) % this.canvas.width;
        const farX = -(this.cameraX * this.scrollSpeedFar) % this.canvas.width;
        const nearX = -(this.cameraX * this.scrollSpeedNear) % this.canvas.width;

        // Himmel als statischen Hintergrund zeichnen
        this.ctx.drawImage(this.backgroundImageSky, 0, 0, this.canvas.width, this.canvas.height);

        // Wolken, die sich kontinuierlich bewegen
        this.ctx.drawImage(this.backgroundImageClouds, cloudsX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageClouds, cloudsX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (cloudsX > 0) {
            this.ctx.drawImage(this.backgroundImageClouds, cloudsX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }

        // Berge
        this.ctx.drawImage(this.backgroundImageMountains, mountainX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageMountains, mountainX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (mountainX > 0) {
            this.ctx.drawImage(this.backgroundImageMountains, mountainX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }

        // Weiter entfernte Hintergrund-Ebenen
        this.ctx.drawImage(this.backgroundImageFar, farX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageFar, farX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (farX > 0) {
            this.ctx.drawImage(this.backgroundImageFar, farX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }

        // Nahe gelegene Hintergrund-Ebenen
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
