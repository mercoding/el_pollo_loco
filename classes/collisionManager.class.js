export class CollisionManager {
    constructor() {
        this.objects = [];
        this.fixedTimeStep = 1 / 60; // 60 Mal pro Sekunde
        this.accumulator = 0;
    }

    addObject(obj) {
        this.objects.push(obj);
    }


    updateCollisions() {
        this.collisionManager.updateCollisions();
        this.gameObjects.forEach(obj => {
            if (obj.updateCollider) {
                obj.updateCollider();
            }
        });
    }

    Update(deltaTime) {
        this.accumulator += deltaTime;

        while (this.accumulator >= this.fixedTimeStep) {
            this.checkCollisions();
            this.accumulator -= this.fixedTimeStep;
        }
    }

    destroy(obj) { this.objects = this.objects.filter(o => o !== obj); }

    reset() { this.objects.forEach(obj => { this.destroy(obj) }); }


    updateCollisionOf(gameObject) {
        for (let index = 0; index < this.objects.length; index++) {
            if (this.objects[index] !== gameObject) {
                this.objects[index].updateCollision(gameObject);
            }
        }
    }

    clear() {
        this.objects.length = 0; // Leert die Liste der Objekte
    }

    checkCollisions() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                const objA = this.objects[i];
                const objB = this.objects[j];
                if (objA.isCollidingWith(objB)) {
                    objA.onCollisionEnter(objB);
                    objB.onCollisionEnter(objA);
                } 
            }
        }
    }
}
