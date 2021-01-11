import * as Preact from 'preact';
import type * as Phaser from 'phaser';

import Component from './Component';

export default class PreactComponent<PropType = undefined> extends Component {
	constructor(scene: Phaser.Scene, root: Preact.VNode | Preact.ComponentType<PropType>, props: PropType) {
		super(scene, 0, 0);

		this.on('addedtoscene', () => {
			const container = document.createElement('div');
			document.querySelector('.Editor')!.appendChild(container);
			Preact.render(props ? Preact.h(root as any as Preact.ComponentType, props) : root, container);
			
			const removedCb = () => {
				Preact.render(null, container);
				container.remove();
				this.off('removedfromscene', removedCb);
			}
			this.on('removedfromscene', removedCb);
		});
	}
}

export function bind<PropType = undefined>(root: Preact.VNode | Preact.ComponentType<PropType>) {
	return class extends PreactComponent<PropType> {
		constructor(scene: Phaser.Scene, props: PropType) {
			super(scene, root, props as any);
		}
	};
}
