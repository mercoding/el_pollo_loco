export class StateMachine {
    constructor(initialState) {
        this.currentState = initialState;
    }

    changeState(newState) {
        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit();
        }
        this.currentState = newState;
        if (this.currentState && this.currentState.onEnter) {
            this.currentState.onEnter();
        }
    }

    update(deltaTime) {
        if (this.currentState && this.currentState.onUpdate) {
            this.currentState.onUpdate(deltaTime);
        }
    }
}
