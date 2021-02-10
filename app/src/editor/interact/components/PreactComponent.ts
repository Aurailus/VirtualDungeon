import * as Preact from 'preact';
import type * as Phaser from 'phaser';

import Component from './Component';

export default class PreactComponent<PropType = undefined> extends Component {
	container?: HTMLDivElement;

	constructor(scene: Phaser.Scene, private root: Preact.VNode | Preact.ComponentType<PropType>, props: PropType) {
		super(scene, 0, 0);

		this.on('addedtoscene', () => {
			this.container = document.createElement('div');
			document.querySelector('.Editor')!.appendChild(this.container);
			this.render(props);

			const killCb = () => {
				this.unRender();
				this.container?.remove();
				this.off('removedfromscene', killCb);
			};

			this.on('removedfromscene', killCb);
		});
	}

	setProps(props: PropType) {
		// this.unRender();
		this.render(props);
	}

	private render = (props: PropType) => {
		Preact.render(props ? Preact.h(this.root as any as Preact.ComponentType, props) : this.root, this.container!);
	};

	private unRender = () => {
		if (!this.container) return;
		Preact.render(null, this.container);
	};
}

export function bind<PropType = undefined>(root: Preact.VNode | Preact.ComponentType<PropType>) {
	return class extends PreactComponent<PropType> {
		constructor(scene: Phaser.Scene, props: PropType) {
			super(scene, root, props as any);
		}
	};
}
