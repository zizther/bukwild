class HhCalc {
	constructor() {
        this.calulate();

        // We listen to the resize event
        window.addEventListener('resize', () => {
            this.calulate();
        });
	}
    calulate() {
        const header = document.getElementById('mn-hdr');

        if (header) {
            // Get the header element height
            let hh = header.offsetHeight;
            // Then we set the value in the --vh custom property to the root of the document
            document.documentElement.style.setProperty('--hh', `${hh}px`);
        }
    }
}

export default new HhCalc();
