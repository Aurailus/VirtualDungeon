import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { NavLink } from 'react-router-dom';

import './InputButton.sass';

interface Props {
	[key: string]: any;

	to?: string;
	onClick?: (e: MouseEvent) => void;

	// icon?: string;
	label?: string;
	altLabel?: boolean;
	altColor?: boolean;
	children?: Preact.ComponentChildren;
}

/**
 * A clean button that can be a link or a true button.
 */

const InputButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>((props, ref) => {
	props.class = ('InputButton ' + (props.altLabel ? 'AltLabel ' : '') + (props.altColor ? 'AltColor ' : '')
		+ (props.disabled ? 'Disabled ' : '') + props.class ?? '').trim();

	if (props.to) {
		props.className = props.class;
		return (
			<NavLink ref={ref as any} {...props as any}>{props.label}{props.children}</NavLink>
		);
	}
	else {
		return (
			<button ref={ref as any} {...props}>{props.label}{props.children}</button>
		);
	}
});

export default InputButton;
