class DelayedCall {
	constructor() {
		this.timeouts = [];
	}
	create(ms, callback) {
	  	let payload = [];

	  	if (arguments.length > 2) {
	    	for (let i = 2; i < arguments.length; i++) {
	      		payload.push(arguments[i]);
	    	}
	  	}

	  	let box = {};

	  	this.timeouts.push(box);
	  	box.callback = callback;
	  	box.payload = payload;

	  	box.id = setTimeout(() => {
	    	this.timeouts.splice(this.timeouts.indexOf(box), 1);

			if (payload.length > 0) {
	      		callback.apply(null, payload);
	    	}
			else {
	      		callback();
	    	}
	  	}, ms);

	  	return box.id;
	}
	clearById(id) {
  		let foundBox = null;
  		for (let i = 0; i < this.timeouts.length; i++) {
    		let currBox = this.timeouts[i];

			if (currBox.id === id) {
      			foundBox = currBox;
      			clearTimeout(id);
      			break;
    		}
  		}

  		if (foundBox !== null) {
    		this.timeouts.splice(this.timeouts.indexOf(foundBox), 1);
  		}
	}
	clearAll() {
  		for (let i = 0; i < this.timeouts.length; i++) {
    		clearTimeout(this.timeouts[i].id);
  		}
  		this.timeouts = [];
	}
	list() {
		return this.timeouts;
	}
}

export default new DelayedCall();
