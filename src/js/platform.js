// Check for HMR and accept changes
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        console.log('HMR');
    });
}

// Wrap the code in an IIFE to prevent polluting the global scope
(function () {
    let modificators = [],
        nv = navigator,
        pl = nv.platform.toLowerCase(),
        ua = nv.userAgent.toLowerCase(),
        an = nv.appName.toLowerCase(),
        htmlElement = document.documentElement,
        ls = localStorage;

    function pli(s) { return pl.indexOf(s) > -1; }
    function uai(s) { return ua.indexOf(s) > -1; }
    function ani(s) { return an.indexOf(s) > -1; }

    // Device
    let deviceClass = uai('iphone') || uai('ipod') || uai('ipad') || uai('android') || uai('iemobile') || uai('blackberry') || uai('bada') ? 'mobile' : 'desktop';
    modificators.push(deviceClass);

    // Platform
    let platformClass = '';
    if (uai('ipad') || uai('iphone') || uai('ipod')) {
        platformClass = 'ios';
    } else if (uai('android')) {
        platformClass = 'android';
    } else if (pli('win')) {
        platformClass = 'win';
    } else if (pli('mac')) {
        platformClass = 'mac';
    } else if (pli('linux')) {
        platformClass = 'linux';
    }
    modificators.push(platformClass);

    // Browser
    let browserClass = '';
    if (uai('firefox')) {
        browserClass = 'firefox';
    } else if (uai('edg')) {
        browserClass = 'edge';
    } else if (uai('trident') || ani('explorer') || ani('msie')) {
        browserClass = 'ie';
    } else if (uai('safari') && !uai('chrome') && !uai('edg')) {
        browserClass = 'safari';
    } else if (uai('chrome') && !uai('edg')) {
        browserClass = 'chrome';
    }
    modificators.push(browserClass);

    let reducedMotion = (function () {
        let mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery) {
            return !!mediaQuery.matches;
        }
        return false;
    })();

    modificators.push(reducedMotion ? 'reduced-motion' : 'full-motion');

    window.environmentObject = {
        device: deviceClass,
        platform: platformClass,
        browser: browserClass,
        reducedMotion: reducedMotion
    };
    htmlElement.className += ' ' + modificators.join(' ');
})();
