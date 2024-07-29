const envObject = window.environmentObject;

/* eslint-disable */
function passiveSupport() {
	let passiveSupported = false;
	try {
		window.addEventListener(
			'test',
			null,
			Object.defineProperty({}, 'passive', {
				get: function() {
					passiveSupported = true;
				},
			})
		);
	} catch (err) {}

	return passiveSupported;
}
/* eslint-enable */

const env = {
	// Platform
	isMobile: envObject.platform === 'mobile',
	isDesktop: envObject.platform === 'desktop',

	// OS
	isMac: envObject.os === 'os-x',
	isWin: envObject.os === 'windows',
	isLinux: envObject.os === 'linux',
    isChromeOS: envObject.os === 'chromeos',
	isAndroid: envObject.os === 'android-os',
	isIOS: envObject.os === 'i-os',

	// Browsers
    isChrome: envObject.browser === 'chrome',
    isSafari: envObject.browser === 'safari',
    isEdge: envObject.browser === 'edge',
	isFF: envObject.browser === 'firefox',
    isIE: envObject.browser === 'ie',
	isOpera: envObject.browser === 'opera',

	// Dev environment
	isLocal: envObject.isLocal,

	// Extra
	havePassive: passiveSupport(),
    reducedMotion: envObject.reducedMotion
};

window.environmentObject = null;
delete window.environmentObject;

export default env;
