/**
 * Class for to handle audio
 *
 * @export
 * @class AudioManager
 * @typedef {AudioManager}
 */
export class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 1.0; 
        this.effectsVolume = 1.0;
        this.isUserInteracted = false; 
        this.pendingAudio = []; 
        this.musicOn = true;
        this.initializeUserInteractionListener();
    }

    /** Initialize user interactions and add listeners */
    initializeUserInteractionListener() {
        const startAudioPlayback = () => {
            this.isUserInteracted = true;
            this.pendingAudio.forEach(({ name, type }) => {
                if (type === 'music') this.playMusic(name);
                if (type === 'sound') this.playSound(name);
            });
            this.pendingAudio = [];
            document.removeEventListener('click', startAudioPlayback);
            document.removeEventListener('keydown', startAudioPlayback);
        };
        document.addEventListener('click', startAudioPlayback);
        document.addEventListener('keydown', startAudioPlayback);
    }

    /**
     * Load sounds
     *
     * @param {*} name
     * @param {*} src
     * @param {boolean} [loop=false]
     */
    loadSound(name, src, loop = false) {
        const audio = new Audio(src);
        audio.loop = loop;
        this.sounds[name] = audio;
    }

    /**
     * Play sounds
     *
     * @param {*} name
     */
    playSound(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        sound.volume = this.effectsVolume;
        if (this.isUserInteracted) {
            sound.play().catch((err) => {
                console.error(`Audio playback failed for ${name}:`, err);
            });
        } else {
            this.pendingAudio.push({ name, type: 'sound' });
        }
    }

    /**
     * Play music
     *
     * @param {*} name
     */
    playMusic(name) {
        const music = this.sounds[name];
        if (!music) return;
        music.volume = this.musicVolume;
        if (this.isUserInteracted) {
            music.play().catch((err) => {
                console.error(`Music playback failed for ${name}:`, err);
            });
        } else {
            this.pendingAudio.push({ name, type: 'music' });
        }
    }

    /**
     * Stop music
     *
     * @param {*} name
     */
    stopMusic(name) {
        const music = this.sounds[name];
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
    }

    /**
     * Stop sound
     *
     * @param {*} name
     */
    stopSound(name) {
        const sounds = this.sounds[name];
        if (sounds) {
            sounds.pause();
            sounds.currentTime = 0;
        }
    }

    /**
     * Pause music
     *
     * @param {*} name
     */
    pauseMusic(name) {
        const music = this.sounds[name];
        if (music) {
            music.pause();
        }
    }

    /**
     * Set music voulume
     *
     * @param {*} volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        for (const sound of Object.values(this.sounds)) {
            if (sound.loop) sound.volume = this.musicVolume;
        }
    }

    /**
     * Set sound volume
     *
     * @param {*} volume
     */
    setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
    }

    /** Stop all sounds and music */
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
        });
    }

    /** Start all sounds and music */
    startAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.play();
            sound.currentTime = 0;
        });
    }

    /** Toggle music */
    toggleMusic() {
        this.musicOn = !this.musicOn;
    }
}
