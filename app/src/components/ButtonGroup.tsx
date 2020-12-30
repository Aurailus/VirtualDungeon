import * as Preact from 'preact';

import './ButtonGroup.sass';

interface Props {
	style?: any;
	class?: string;
	children: Preact.ComponentChildren;
}

/**
 * Wrapper for multiple buttons, styles them as a button group.
 * Undefined behavior if anything other than buttons are provided as children.
 */

export default function ButtonGroup(props: Props) {
	return (
		<div class={('ButtonGroup ' + (props.class ?? '')).trim()} style={props.style}>
			{props.children}
		</div>
	);
}
