// Imports
import { lock, unlock } from 'tua-body-scroll-lock';

// Project imports
import env from '@js/utils/env';
import Signal from '@js/classes/Signal';

const HTML_CLASSLIST = document.documentElement.classList;
const CSS_SCROLLED = '_scrolled';
const CSS_MAX_SCROLLED = '_max-scrolled';
const CSS_SCROLLABLE = '_scrollable';
const CSS_NO_SCROLL = '_no-scroll';
const CSS_SCROLLED_DOWN = '_scrolled-down';
const CSS_SCROLLED_UP = '_scrolled-up';
const CSS_SCREEN_SCROLLED = '_scrolled-screen';

class PageScrolling {
	constructor() {
		this.onScroll = new Signal();
		this.onUpdate = new Signal();

		this.lock = this.unlock = this.reset = () => {
			//
		};
	}
	start() {
		//this.autoScrolling = false;
		this.mobileMode = env.isMobile;

        // Uncomment for SPA
		//window.scrollTo(0, 0);

        this._init();

        // Uncomment for SPA
		// if (!this.mobileMode) {
		// 	window.addEventListener('beforeunload', () => {
		// 		window.scrollTo(0, 0);
		// 	});
        //
		// 	window.history.scrollRestoration = 'manual';
		// }

		window.addEventListener('resize', (e) => {
			this._updateMaxScroll();
		});
		this._updateMaxScroll();
	}
	_updateMaxScroll() {
		this.maxScrollTop =
			Math.max(
				document.body.scrollHeight,
				document.body.offsetHeight,
				document.documentElement.clientHeight,
				document.documentElement.scrollHeight,
				document.documentElement.offsetHeight
			) - window.innerHeight;
	}
	update() {
		this._updateMaxScroll();
		this.onUpdate.call();
	}
	_manageDocumentClass() {
		// Scrolled and No Scroll
		if (this.maxScrollTop > 0) {
			this.scrollTop > 0
				? HTML_CLASSLIST.add(CSS_SCROLLED)
				: HTML_CLASSLIST.remove(CSS_SCROLLED);

			HTML_CLASSLIST.remove(CSS_NO_SCROLL);
		}
        else {
			HTML_CLASSLIST.add(CSS_NO_SCROLL);
		}

		// Scrollable and Max scrolled
		if (this.maxScrollTop > window.innerHeight + 200) {
			this.scrollTop >= this.maxScrollTop - 100
				? HTML_CLASSLIST.add(CSS_MAX_SCROLLED)
				: HTML_CLASSLIST.remove(CSS_MAX_SCROLLED);

			HTML_CLASSLIST.add(CSS_SCROLLABLE);
		}
        else {
			HTML_CLASSLIST.remove(CSS_MAX_SCROLLED);
			HTML_CLASSLIST.remove(CSS_SCROLLABLE);
		}

		// Scroll direction
		const direction = this.scrollTop > this.prevScrollTop ? 1 : -1;
		if (this.scrollDirection !== direction) {
			this.scrollDirection = direction;

			if (this.scrollDirection === 1) {
				HTML_CLASSLIST.add(CSS_SCROLLED_DOWN);
				HTML_CLASSLIST.remove(CSS_SCROLLED_UP);
			} else {
				HTML_CLASSLIST.add(CSS_SCROLLED_UP);
				HTML_CLASSLIST.remove(CSS_SCROLLED_DOWN);
			}
		}

		// Scroll screen height
		let screenScrolled = this.scrollTop > window.innerHeight;
		if (this.screenScrolled !== screenScrolled) {
			this.screenScrolled = screenScrolled;

			if (this.screenScrolled) {
				HTML_CLASSLIST.add(CSS_SCREEN_SCROLLED);
			}
            else {
				HTML_CLASSLIST.remove(CSS_SCREEN_SCROLLED);
			}
		}

		this.prevScrollTop = this.scrollTop;
	}
	_init() {
		this.scrollTop = window.pageYOffset || document.body.scrollTop;

		window.addEventListener(
			'scroll',
			(e) => {
				const scrollTop =
					window.pageYOffset || document.body.scrollTop;
				this.scrollTop = scrollTop < 0 ? 0 : scrollTop;
				this._manageDocumentClass();
				this.onScroll.call(this.scrollTop, this.maxScrollTop);
			},
			env.havePassive ? { passive: true } : false
		);

		window.addEventListener('resize', (e) => {
			this._updateMaxScroll();
		});

		this._updateMaxScroll();

		let isLocked = false;
		this.lock = () => {
			if (!isLocked) {
				isLocked = true;
				HTML_CLASSLIST.add('_scroll-locked');
			}
		};
		this.unlock = () => {
			if (isLocked) {
				isLocked = false;
				HTML_CLASSLIST.remove('_scroll-locked');
			}
		};
		this.reset = () => {
			this.scrollTo(0, true);
		};
	}
}

export default new PageScrolling();
