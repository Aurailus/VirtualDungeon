import * as Preact from 'preact';
import { NavLink as Link } from 'react-router-dom';

import './Button.sass';

interface Props {
	label?: string;
	icon?: string;
	alt?: string;

	inactive?: boolean;
	disabled?: boolean;
	noFocus?: boolean;

	to?: string;
	onClick?: (evt: MouseEvent) => void;

	style?: any;
	class?: string;
}

/**
 * Custom button that applies button styling,
 * and allows for icons as well as labels.
 */

export default function Button(props: Props) {
	const icon = props.icon && <img src={`/app/static/icon/${props.icon}.png`}
		class='Button-Icon' alt={props.alt ?? (props.label ? '' : undefined)} />;
	const label = props.label && <span class='Button-Label'>{props.label}</span>;

	const classes = ('Button ' + (props.class ?? '') + (props.disabled ? ' Disabled' : '') +
		(props.inactive ? ' Inactive' : '')).trim();

	const handleFocus = props.noFocus ? (e: any) => {
		e.target.blur();
		e.preventDefault();
		e.stopPropagation();
	} : undefined;

	if (props.to) return (
		<Link
			className={classes} style={props.style}
			onFocus={handleFocus}
			tabIndex={props.disabled || props.noFocus ? -1 : undefined}
			to={props.disabled ? '' : props.to}
		>
			{icon}{label}
		</Link>
	);
	else return (
		<button
			class={classes} style={props.style} disabled={props.disabled}
			onFocus={handleFocus}
			tabIndex={props.noFocus ? -1 : undefined}
			onClick={props.onClick}
		>
			{icon}{label}
		</button>
	);
}
