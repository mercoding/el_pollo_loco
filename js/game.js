import { Character } from "../classes/character.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Game } from "../classes/game.class.js";
import { GameObject } from "../classes/gameObject.class.js";

const game = new Game();
let character, chicken;
const ground = new GameObject(0, 250, 500, 20);

const pepeAnimations = {
    idle: { path: 'img/pepe/idle', frameCount: 10 },
    walk: { path: 'img/pepe/walk', frameCount: 6 },
    hurt: { path: 'img/pepe/hurt', frameCount: 3 },
    jump: { path: 'img/pepe/jump', frameCount: 9 },
    dead: { path: 'img/pepe/dead', frameCount: 7 }
};

const chickenAnimations = {
    walk: { path: 'img/enemy_chicken/walk', frameCount: 3 },
    dead: { path: 'img/enemy_chicken/dead', frameCount: 1 }
};

function init() {
    character = new Character(10, 350, 50, 150, pepeAnimations);
    chicken = new Chicken(200, 160, 30, 30, chickenAnimations);
    game.addGameObject(character);

    control();
    game.Start();
}

function control() {
    
    
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowLeft': 
                if(character.onGround) character.setState('walk');
                //character.Translate(-1, 0, 0);
                character.facingRight = false;
                game.keysPressed.left = true;
                break;
            case 'ArrowRight': 
                if(character.onGround) character.setState('walk');
                //character.Translate(1, 0, 0); 
                character.facingRight = true;
                game.keysPressed.right = true;
                break;
            case 'ArrowUp':
                if (character.onGround) {
                    character.jump(); // Springen und Zustand wird innerhalb von `jump()` gesetzt
                }
                break;
        }
    });

    document.addEventListener('keyup', event => {
        if(['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            character.Translate(0, 0, 0);
            character.moveSimulation = false;
            character.keyPressed = false;
            game.keysPressed.right = false;
            game.keysPressed.left = false;
            if (character.onGround) character.setState('idle'); // Nur zurück zu `idle`, wenn er am Boden ist
        }
    });
    
}

window.init = init;
