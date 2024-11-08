export class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameObjects = [];
        this.lastFrameTime = 0;
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    Start() {
        this.gameObjects.forEach(obj => obj.Start());
        this.lastFrameTime = performance.now();
        this.Update();
    }

    Update() {
        const currentFrameRateTime = performance.now();
        const deltaTime = (currentFrameRateTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameRateTime;
        this.ClearCanvas();
        this.gameObjects.forEach(obj => obj.Update(this.ctx, deltaTime));
        requestAnimationFrame(() => this.Update());
    }

    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.height);
    }
}