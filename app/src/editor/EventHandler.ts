export default class EventHandler<E = undefined> {
	callbacks: Set<(evt: E) => boolean | void> = new Set();

	bind(cb: (evt: E) => boolean | void) {
		this.callbacks.add(cb);
	}

	unbind(cb: (evt: E) => boolean | void) {
		this.callbacks.delete(cb);
	}

	dispatch(evt: E) {
		for (let cb of [ ...this.callbacks ].reverse()) if (cb(evt)) return;
	}
}
