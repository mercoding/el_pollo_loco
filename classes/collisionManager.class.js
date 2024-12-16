/**
 * Class to handle all collisions in game
 *
 * @export
 * @class CollisionManager
 * @typedef {CollisionManager}
 */
export class CollisionManager {
    constructor() {
        this.objects = [];
        this.fixedTimeStep = 1 / 60; // 60 Mal pro Sekunde
        this.accumulator = 0;
    }

    /**
     * Add object to collision manager
     *
     * @param {*} obj
     */
    addObject(obj) {
        this.objects.push(obj);
    }


    /** Update collisions */
    updateCollisions() {
        this.collisionManager.updateCollisions();
        this.gameObjects.forEach(obj => {
            if (obj.updateCollider) {
                obj.updateCollider();
            }
        });
    }

    /**
     * Update function for check collisions
     *
     * @param {*} deltaTime
     */
    Update(deltaTime) {
        this.accumulator += deltaTime;

        while (this.accumulator >= this.fixedTimeStep) {
            this.checkCollisions();
            this.accumulator -= this.fixedTimeStep;
        }
    }

    /**
     * Destroy object from collision manager
     *
     * @param {*} obj
     */
    destroy(obj) { this.objects = this.objects.filter(o => o !== obj); }

    /** Remove all objects from collision manager */
    reset() { this.objects.forEach(obj => { this.destroy(obj) }); }


    /**
     * Update specific collision of a game object
     *
     * @param {*} gameObject
     */
    updateCollisionOf(gameObject) {
        for (let index = 0; index < this.objects.length; index++) {
            if (this.objects[index] !== gameObject) {
                this.objects[index].updateCollision(gameObject);
            }
        }
    }

    /** Clear object list  */
    clear() {
        this.objects.length = 0; // Leert die Liste der Objekte
    }

    /** Check collisions */
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
