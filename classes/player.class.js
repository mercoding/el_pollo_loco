import { pepeAnimations } from "../animations/character.anim.js";
import { Character } from "./character.class.js";
import { InputHandler } from "./inputHandler.class.js";

export class Player {
    constructor(canvas, global) {
        this.canvas = canvas;
        this.global = global;
        this.inputHandler = new InputHandler();
        //this.initializeCharacter();
    }

    initializeCharacter() {
        // Erstelle und füge den Charakter hinzu
        this.character = new Character(pepeAnimations, this.global.collisionManager, this.canvas.width, 430, 50, 150, 'Player');
        this.character.global = this.global;
        this.global.addGameObject(this.character);
        this.global.collisionManager.addObject(this.character);
    }

    resetCharacter() {
        // Entferne den bestehenden Charakter
        if (this.character) {
            this.global.destroy(this.character);
            this.global.collisionManager.destroy(this.character);
        }

        this.inputHandler.deactivate();
        // Initialisiere den Charakter neu
        this.initializeCharacter();
    }

    Start() {
        // Initiale Logik bei Spielstart, falls nötig
        this.initializeCharacter();
        this.character.Start();
    }

    Update(ctx, deltaTime) {
        if (this.global.pause) return;
        if(this.global.gameOver) {
            this.character.velocity.x = 0;
            this.character.velocity.y = 0;
            if(this.character.state != 'dead') this.character.setState('idle');
            return;
        }
        this.handleCameraAndCharacterMovement(this.character, deltaTime);
    }

    handleInput(deltaTime) {
        if (this.global.health <= 0 || this.global.pause) return;

        const input = this.inputHandler.getInput();

        if (this.character.isHurt) {
            this.character.velocity.x = 0;
            this.character.velocity.y = 30;
            this.character.move(deltaTime);
            return;
        }

        if (input.right) {
            this.character.walk(true, 1, 100);
        } else if (input.left) {
            this.character.walk(false, -1, 100);
        } else {
            this.character.idle();
        }

        if (input.up) {
            this.character.jump();
        }

        if (input.fKey) {
            this.character.throwBottle();
        }

        this.character.move(deltaTime);
    }

    handleCameraAndCharacterMovement(character, deltaTime) {
        if (this.global.pause) return;

        this.cameraX = character.x; // Zentriere die Kamera auf den Charakter
        this.handleInput(deltaTime);
        character.updateCollider(); // Aktualisiere den Collider des Charakters
    }
}
