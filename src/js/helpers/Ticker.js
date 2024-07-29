import Signal from '@js/classes/Signal';
import utils from '@js/utils/utils';

class Ticker {
	constructor() {
		this.onTick = new Signal();

		this.debugEnabled = false;
		this.forcingMaximum = false;

		/*this.stats = new Stats();
		this.stats.showPanel(0);
		this.stats.dom.style.left = '50%';
		this.stats.dom.style.top = '2px';
		this.stats.dom.style.marginLeft = '-40px';*/

		let activeState = true;
		let prevTime = utils.now();
		let elapsedTime = 0;
		let timeScale = 1;

		let skippedFrames = 0;
		const maxSkipFrames = 3;

		this.stop = this.pause = this.sleep = function() {
			activeState = false;
			return this;
		};

		this.start = this.wake = function() {
			activeState = true;
			return this;
		};

		this.reset = function() {
			elapsedTime = 0;
		};

		this.timeScale = function(value) {
			if (typeof value !== 'undefined') {
				timeScale = value;
				return this;
			}

			return timeScale;
		};

		this.toggle = function() {
			return activeState ? this.stop() : this.start();
		};

		this.isActive = function() {
			return activeState;
		};

		this.getTime = function() {
			return elapsedTime;
		};

		const render = () => {
			//this.debugEnabled && this.stats.begin();

			const nowTime = utils.now();
			const delta = (nowTime - prevTime) * timeScale;
			prevTime = nowTime;

			if (skippedFrames < maxSkipFrames) {
				skippedFrames++;
			} else {
				if (activeState) {
					elapsedTime += delta;
					this.onTick.call(delta, elapsedTime);
				}
			}

			//this.debugEnabled && this.stats.end();
		};

		gsap.ticker.add(() => {
			render();
		});

		setInterval(() => {
			this.forcingMaximum && render();
		}, 0);
		window.addEventListener('resize', e => {
			this.forcingMaximum && render();
		});
	}
	debug(state) {
		if (this.debugEnabled !== state) {
			this.debugEnabled = state;
			if (state) {
				//document.body.appendChild(this.stats.dom);
			} else {
				//document.body.removeChild(this.stats.dom);
			}
		}
	}
	forceMaximum(state) {
		if (typeof state !== 'undefined') {
			this.forcingMaximum = !!state;
		}
		return this.forcingMaximum;
	}
}

export default new Ticker();
