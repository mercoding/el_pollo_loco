/**
 * State machine for endboss - AI
 *
 * @export
 * @class StateMachine
 * @typedef {StateMachine}
 */
export class StateMachine {
    constructor(initialState) {
        this.currentState = initialState;
    }

    /**
     * Change current state
     *
     * @param {*} newState
     */
    changeState(newState) {
        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit();
        }
        this.currentState = newState;
        if (this.currentState && this.currentState.onEnter) {
            this.currentState.onEnter();
        }
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    Update(deltaTime) {
        if (this.currentState && this.currentState.onUpdate) {
            this.currentState.onUpdate(deltaTime);
        }
    }
}
