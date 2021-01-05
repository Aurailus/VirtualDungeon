import * as Preact from 'preact';
import { NavLink as Link } from 'react-router-dom';

import './Button.sass';

interface Props {
	label?: string;
	icon?: string;
	alt?: string;

	inactive?: boolean;
	disabled?: boolean;

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
	const icon = props.icon && <img src={`/app/static/ui/icon/${props.icon}.png`}
		class='Button-Icon' alt={props.alt ?? (props.label ? '' : undefined)} />;
	const label = props.label && <span class='Button-Label'>{props.label}</span>;

	const classes = ('Button ' + (props.class ?? '') + (props.disabled ? ' Disabled' : '') +
		(props.inactive ? ' Inactive' : '')).trim();

	if (props.to) return <Link className={classes} style={props.style} to={props.disabled ? '' : props.to}
		tabIndex={props.disabled ? -1 : undefined}>{icon}{label}</Link>;
	return <button class={classes} style={props.style} disabled={props.disabled} onClick={props.onClick}>{icon}{label}</button>;
}
