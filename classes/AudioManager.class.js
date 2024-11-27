export class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 1.0; // Standardlautstärke
        this.effectsVolume = 1.0;
        this.isUserInteracted = false; // Benutzerinteraktion
        this.pendingAudio = []; // Warteschlange für Audio
        this.musicOn = true;
        // Warte auf Benutzerinteraktion
        this.initializeUserInteractionListener();
    }

    initializeUserInteractionListener() {
        const startAudioPlayback = () => {
            this.isUserInteracted = true;
            // Spielt alle wartenden Audios ab
            this.pendingAudio.forEach(({ name, type }) => {
                if (type === 'music') this.playMusic(name);
                if (type === 'sound') this.playSound(name);
            });
            this.pendingAudio = [];
            // Entfernt den Listener nach der ersten Interaktion
            document.removeEventListener('click', startAudioPlayback);
            document.removeEventListener('keydown', startAudioPlayback);
        };

        document.addEventListener('click', startAudioPlayback);
        document.addEventListener('keydown', startAudioPlayback);
    }

    loadSound(name, src, loop = false) {
        const audio = new Audio(src);
        audio.loop = loop;
        this.sounds[name] = audio;
    }

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

    stopMusic(name) {
        const music = this.sounds[name];
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
    }

    stopSound(name) {
        const sounds = this.sounds[name];
        if (sounds) {
            sounds.pause();
            sounds.currentTime = 0;
        }
    }

    pauseMusic(name) {
        const music = this.sounds[name];
        if (music) {
            music.pause();
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        for (const sound of Object.values(this.sounds)) {
            if (sound.loop) sound.volume = this.musicVolume;
        }
    }

    setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    startAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.play();
            sound.currentTime = 0;
        });
    }

    toggleMusic() {
        this.musicOn = !this.musicOn;
    }
}
