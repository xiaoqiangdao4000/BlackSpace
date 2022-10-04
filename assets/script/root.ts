import { _decorator, Component, Node, AudioSource } from 'cc';
import { AudioManager } from './audioManager';
const { ccclass, property } = _decorator;

@ccclass('root')
export class root extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    private _audioSource: AudioSource = null!;

    onLoad () {
        const audioSource = this.getComponent(AudioSource)!;
        this._audioSource = audioSource;
        // init AudioManager
        AudioManager.init(audioSource);
    }
}

