class ViewHeightCalc {
	constructor() {
        this.calulate();

        // We listen to the resize event
        window.addEventListener('resize', () => {
            this.calulate();
        });
	}
    calulate() {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh.toFixed(2)}px`);
    }
}

export default new ViewHeightCalc();
