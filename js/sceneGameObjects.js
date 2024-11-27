import { Coin } from "../classes/coin.class.js";

export const obstaclePositions = [
    -9000, -8500, -8000, -7500, -7000, -6500, -6000, -5500, -5000,
    -4500, -4000, -3500, -3000, -2500, -2000, -1500, -1000, -500,
    500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500,
    5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000
    // etc.
];

export const enemyBossPositions = [-10000, 10000];


function isCurved(isCurvedRow, i, baseYPosition, numberOfCoins) {
    let y = 0;
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
    return y;
}

function adjustCoinPosition(coinX, minDistance = 50) {
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

function isCoinNearby(game, x, y, threshold = 50) {
    // Prüfe, ob ein Coin in der Nähe der geplanten Position ist
    return game.global.gameObjects.some(obj => {
        return obj instanceof Coin &&
            Math.abs(obj.x - x) < threshold &&  // Horizontal in der Nähe
            Math.abs(obj.y - y) < threshold;    // Vertikal in der Nähe
    });
}

function spawnCoin(game, character, direction, startX, baseYPosition, numberOfCoins, isCurvedRow) {
    for (let i = 0; i < numberOfCoins; i++) {
        let x = startX + i * game.coinSpacing * direction;
        // Berechne die Y-Position für die Coins
        let y = isCurved(isCurvedRow, i, baseYPosition, numberOfCoins);
        x = adjustCoinPosition(x, 50);
        if (!isCoinNearby(game, x, y, 80)) {
            const coin = new Coin(game.global.collisionManager, 1, x, y, 30, 30, 'Coin'); // Größe und Punktewert der Coins
            coin.player = character;
            coin.global = game.global;
            game.global.addGameObject(coin);
            game.global.collisionManager.addObject(coin);
        }
    }
}


export function checkAndSpawnCoinRow(game, performance, character) {
    if (character.x > 9000 || character.x < -9000) return;
    if (character.state === 'idle') return;
    const currentTime = performance.now() / 1000;
    const direction = character.facingRight ? 1 : -1;
    const startX = character.x + direction * (game.canvas.width / 2 + 100); // Spawnt Coins außerhalb des Canvas
    const baseYPosition = game.groundLevel - 80; // Basis-Höhe für die Coin-Reihe
    if (currentTime - game.lastSpawnTime < game.spawnCoinCooldown) return;
    const isCurvedRow = Math.random() < 0.7; // 50% Wahrscheinlichkeit für eine gebogene Reihe
    const numberOfCoins = Math.floor(Math.random() * 6) + 3;
    spawnCoin(game, character, direction, startX, baseYPosition, numberOfCoins, isCurvedRow);
    game.lastSpawnTime = currentTime;
    game.lastCharacterX = character.x;
}
