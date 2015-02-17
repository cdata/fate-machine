import { Behavior } from '../../behavior';
import { Transform } from '../../aspect/transform';

let ready = Symbol('ready');
let loads = Symbol('loads');
let timeData = Symbol('timeData');
let globalAudioSources = {};

class AudioSource {
  static get globalAudioSources () {
    return globalAudioSources;
  }

  static toFullUrl (url) {
    return new URL(url, document.baseURI).href;
  }

  static getGlobalAudioSource (url) {
    let url = this.toFullUrl(url);

    if (!(url in this.globalAudioSources)) {
      this.globalAudioSources[url] = new AudioSource(url);
    }

    return this.globalAudioSources[url];
  }

  constructor (url) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.connect(this.audioContext.destination);
    this[timeData] = new Uint8Array(this.analyser.frequencyBinCount)
    this.url = url;
    this.bufferSource = null;
    this.buffer = null;

    this[ready] = false;

    this.load();
  }

  get loads () {
    return this[loads];
  }

  get ready () {
    return !!this.buffer;
  }

  get position () {
    return 0;
  }

  get timeData () {
    this.analyser.getByteTimeDomainData(this[timeData]);
    return this[timeData];
  }

  load () {
    if (this.loads) {
      return;
    }

    this[loads] = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      let that = this;

      request.open('GET', this.url, true);
      request.responseType = 'arraybuffer';

      request.addEventListener('load', function audioLoaded () {
        request.removeEventListener('load', audioLoaded);

        that.audioContext.decodeAudioData(request.response, function (soundBuffer) {
          that.buffer = soundBuffer;
          this[ready] = true;
          resolve();
        }, function (error) {
          reject(error);
        });
      });

      request.send();
    });
  }

  stop () {
    if (this.bufferSource) {
      this.bufferSource.disconnect();
      this.bufferSource.stop();
      this.bufferSource = null;
    }
  }

  play (position = 0) {
    this.loads.then(() => {
      this.stop();

      this.bufferSource = this.audioContext.createBufferSource();
      this.bufferSource.connect(this.analyser);
      this.bufferSource.buffer = this.buffer;
      this.bufferSource.start(0, position);
    });
  }
}

let url = Symbol('url');

class Sound {
  constructor (url = null) {
    this.audioSource = null;
    this.url = url;
  }

  set url (value) {
    if (value) {
      this.audioSource = AudioSource.getGlobalAudioSource(value);
    } else {
      this.audioSource = null;
    }
  }

  get url () {
    return this.audioSource && this.audioSource.url;
  }
}

class Frequency {
  constructor (index, total) {
    this.index = index;
    this.total = total;
  }

  get ratio () {
    return this.index / this.total;
  }
}

class Oscillates extends Behavior {
  static get requiredAspects () {
    return {
      sound: Sound,
      frequency: Frequency,
      transform: Transform
    };
  }

  update (delta) {
    if (!this.sound.audioSource.ready) {
      return;
    }

    let currentValue = this.currentValue;

    this.transform.position.x = this.frequency.ratio * window.innerWidth + window.innerWidth / this.frequency.total / 2;
    this.transform.position.y = currentValue / 128.0 * 200;

    let scale = ((currentValue - 128.0) / 128.0);

    if (scale < 0.1 && scale >= 0.0) {
      scale = 0.1;
    } else if (scale > -0.1 && scale < 0.0) {
      scale = -0.1;
    }

    this.transform.scale.y = scale * 200;
    this.transform.scale.x = window.innerWidth / this.frequency.total;
  }

  get timeDataIndex () {
    return 0|(this.timeDataSize * this.frequency.ratio);
  }

  get timeDataSize () {
    return this.sound.audioSource.analyser.frequencyBinCount;
  }

  get timeData () {
    return this.sound.audioSource.timeData;
  }

  get currentValue () {
    return this.timeData[this.timeDataIndex];
  }
}

export { AudioSource, Sound, Frequency, Oscillates };
