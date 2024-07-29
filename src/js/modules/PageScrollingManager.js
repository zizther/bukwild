import Signal from '@js/classes/Signal';
import PageScrolling from '@js/modules/PageScrolling';

class PageScrollingManager {
	constructor() {
		this.onUpdate = new Signal();

		this.watchTargets = [];
		this.windowHeight = window.innerHeight;

		window.addEventListener('resize', () => {
			this.updateGeometries();
		});
		PageScrolling.onScroll.add(() => {
			this.update();
		});

		this.updateGeometries();
	}
	updateGeometries() {
		this.windowHeight = window.innerHeight;
		const scrollTop = PageScrolling.scrollTop;

		for (let k = 0; k < this.watchTargets.length; k++) {
			const watchTarget = this.watchTargets[k];

			const bBox = watchTarget.element.getBoundingClientRect();
			watchTarget.top = bBox.top + scrollTop;
			watchTarget.bottom = bBox.top + bBox.height + scrollTop;
			watchTarget.height = bBox.height;
		}

		this.update();
	}
	update(forceUpdateGeometries = false) {
		if (forceUpdateGeometries) {
			this.updateGeometries();
		}

		for (let k = 0; k < this.watchTargets.length; k++) {
			const watchTarget = this.watchTargets[k];

			let viewTop = PageScrolling.scrollTop;
			let viewBottom = viewTop + this.windowHeight;

			viewTop += (this.windowHeight * (1 - watchTarget.viewportScale)) / 2;
			viewBottom -= (this.windowHeight * (1 - watchTarget.viewportScale)) / 2;

			const top = watchTarget.top;
			const bottom = watchTarget.bottom;
			const height = watchTarget.height;

			const isInViewport = top < viewBottom && bottom > viewTop;

			if (watchTarget.state !== isInViewport && watchTarget.stateHandler) {
				watchTarget.state = isInViewport;

				watchTarget.stateHandler(isInViewport, watchTarget.element);
			}

			const offsetTop = Math.min(this.windowHeight, top);
			let ratio = -(top - viewTop - offsetTop) / (height + offsetTop);

			if (isInViewport && watchTarget.ratioHandler) {
				ratio = ratio < 0 ? 0 : ratio;
				ratio = ratio > 1 ? 1 : ratio;

				if (watchTarget.ratio !== ratio) {
					watchTarget.ratio = ratio;

					watchTarget.ratioHandler(ratio, watchTarget.element);
				}
			}

			if (isInViewport && watchTarget.geometryHandler) {
				watchTarget.geometryHandler(top - viewTop, bottom - viewTop);
			}
		}

		this.onUpdate.call(PageScrolling.scrollTop / PageScrolling.maxScrollTop);
	}
	watch(element, stateHandler, ratioHandler, geometryHandler = null, viewportScale = 1) {
		const watchTarget = {
			element,
			stateHandler,
			ratioHandler,
			state: null,
			ratio: 0,
			geometryHandler,
			viewportScale,
		};
		this.watchTargets.push(watchTarget);

		this.update(true);

		return watchTarget;
	}
	watchOnce(element, handler, viewportScale = 1) {
		const watchTarget = {
			element,
			stateHandler: state => {
				if (state) {
					this.unwatch(watchTarget);
					handler();
				}
			},
			state: null,
			ratio: 0,
			viewportScale,
		};
		this.watchTargets.push(watchTarget);

		this.update(true);

		return watchTarget;
	}
	unwatch(watchTarget) {
		if (watchTarget.deleted) {
			return;
		}
		const index = this.watchTargets.indexOf(watchTarget);
		if (index !== -1) {
			watchTarget.deleted = true;
			this.watchTargets.splice(index, 1);
		} else {
			console.warn('PageScrollingManager: No watchTarget founded');
		}
	}
}

export default new PageScrollingManager();
