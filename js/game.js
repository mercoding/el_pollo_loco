import { Character } from "../classes/character.class.js";
import { Game } from "../classes/game.class.js";

const game = new Game();
let pepeImgSrc = '../img/2_character_pepe/2_walk/W-21.png';
let character;
const pepeAnimations = {
    idle: { path: 'img/pepe/idle', frameCount: 10 },
    walk: { path: 'img/pepe/walk', frameCount: 6 },
    hurt: { path: 'img/pepe/hurt', frameCount: 3 },
    jump: { path: 'img/pepe/jump', frameCount: 9 },
    dead: { path: 'img/pepe/dead', frameCount: 7 }
}

function init() {
    character = new Character(20, 100, 50, 150, pepeAnimations);
    game.addGameObject(character);
    control();
    game.Start();
}

function control() {
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowLeft': 
                character.setState('walk');
                character.Translate(-1, 0, 200);
                character.facingRight = false;
            break;
            case 'ArrowRight': 
                character.setState('walk');
                character.Translate(1, 0, 200); 
                character.facingRight = true;
            break;
            case 'ArrowUp':
                character.setState('jump');
                character.Translate(0, -1, 200);

            break;
            case 'ArrowDown':
                character.setState('jump');
                character.Translate(0, 1, 200);

            break;
        }
    });

    document.addEventListener('keyup', event => {
        if(['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            character.Translate(0, 0, 0);
            character.setState('idle');
        }
        else if(event.key === 'ArrowUp') {
            //character.setState('idle');
            character.Translate(0, 0, 200);
        }
    });
}


window.init = init;