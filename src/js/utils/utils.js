const utils = {
	now: () => (window.performance && window.performance.now ? window.performance.now() : Date.now()),

	cubicProgress: (value) => {
		value = Math.min(1, Math.max(0, value));
		value /= 1 / 2;
		if (value < 1) {
			return (1 / 2) * value ** 3;
		}
		value -= 2;
		return (1 / 2) * (value ** 3 + 2);
	},

	debounce: (func, wait = 100) => {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	},

	throttle: (func, wait = 100) => {
		let isThrottled = false;
		return function (...args) {
			if (!isThrottled) {
				func.apply(this, args);
				isThrottled = true;
				setTimeout(() => isThrottled = false, wait);
			}
		};
	},

	isEscape: (event) => event.key === "Escape" || event.key === "Esc",

	passiveSupport: () => {
		let supported = false;
		try {
			window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
				get: () => supported = true
			}));
		} catch (err) {}
		return supported;
	},

	hasPassiveEvents: (() => {
		let supported = false;
		try {
			window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
				get: () => supported = true
			}));
		} catch (err) {}
		return supported;
	})(),

	testHitViewport: (el) => {
		const rect = el.getBoundingClientRect();
		// DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
		const windowHeight = window.innerHeight || document.documentElement.clientHeight;
		const windowWidth = window.innerWidth || document.documentElement.clientWidth;
		// http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
		const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
		const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
		return vertInView && horInView;
	},

	isEmptyOrNullOrUndefined: (str) => {
		return !str || !str.trim();
	},

	getCookie: (cookieName) => {
		var name = cookieName + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var cookieArray = decodedCookie.split(';');

		for (var i = 0; i < cookieArray.length; i++) {
			var cookie = cookieArray[i];

			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1);
			}
			if (cookie.indexOf(name) === 0) {
				return cookie.substring(name.length, cookie.length);
			}
		}
		return "";
	},

    // Function to format a number based on user's language
	formatNumberLocale: (number) => {
        // Get user's language or use a default language if not available
        const userLanguage = navigator.language || navigator.userLanguage || 'en-US';

        // Use Intl.NumberFormat to format the number based on user's language
        const formattedNumber = new Intl.NumberFormat(userLanguage).format(number);

        return formattedNumber;
    },

	formatNumberOverview: (number) => {
		if (number < 1000) {
			return number.toString();
		}

		const abbreviations = ['k', 'M', 'B', 'T'];
		let tier = Math.log10(number) / 3 | 0;

		// Ensuring the tier is within the valid range of abbreviations
		tier = Math.max(0, Math.min(tier, abbreviations.length - 1));

		// Scaling the number and rounding it to one decimal place
		const scaled = number / Math.pow(1000, tier);
		const rounded = Number(scaled.toFixed(1));

		return rounded + abbreviations[tier - 1];
	},
};

export default utils;

