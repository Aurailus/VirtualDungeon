import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useEffect, useRef, useContext } from 'preact/hooks';

import './InputSelectRow.sass';

import { WidgetProps } from '../Input';

interface InputSelectRowContextData {
	selected: string;
	onSelect: (name: string) => void;
	disabled: boolean;
}

const InputSelectRowContext = Preact.createContext<InputSelectRowContextData>(
	{ selected: '', onSelect: () => { /* Nothing */ }, disabled: false });

interface ItemProps {
	[key: string]: any;

	label: string;
	name: any;
}

/**
 *
 */

export const InputSelectRowItem = forwardRef<HTMLButtonElement, ItemProps>((props, ref) => {
	const ctx = useContext(InputSelectRowContext);

	return (
		<button ref={ref} {...props} onClick={() => ctx.onSelect(props.name)} data-name={props.name}
			class={'InputSelectRowItem ' + (props.name === ctx.selected ? 'Selected' : '')} disabled={ctx.disabled} >
			{props.label}
		</button>
	);
});

interface Props extends WidgetProps {
	children: Preact.ComponentChildren;
}

/**
 * A row of buttons, where a single one can be selected.
 */

const InputSelectRow = forwardRef<HTMLDivElement, Props>((props, fRef) => {
	const ref = useRef<HTMLDivElement>(null);

	const [ ctx, setCtx ] = useState<InputSelectRowContextData>(
		{ selected: props.value, onSelect: props.setValue, disabled: props.disabled ?? false });

	const [ highlight, setHighlight ] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

	useEffect(() => {
		setCtx(ctx => ({ ...ctx, selected: props.value, onSelect: props.setValue, disabled: props.disabled ?? false }));
	}, [ props.value, props.setValue, props.disabled ]);

	const handleRef = (e: HTMLDivElement | null) => {
		ref.current = e!;
		if (fRef) fRef.current = e!;
	};

	useEffect(() => {
		if (!ref.current) return;

		const wrap = ref.current.getBoundingClientRect();
		const b = (ref.current.querySelector(`[data-name='${props.value}']`) as any);
		if (!b) return;
		const button = b.getBoundingClientRect();

		setHighlight({ left: button.left - wrap.left, width: button.width });
	}, [ props.value ]);

	return (
		<InputSelectRowContext.Provider value={ctx}>
			<div ref={handleRef} class={('InputSelectRow ' + (props.disabled ? 'Disabled ' : '') + (props.class ?? '')).trim()}>
				<div class='InputSelectRow-Highlight' style={{ left: highlight.left + 'px', width: highlight.width + 'px' }} />
				{props.children}
			</div>
		</InputSelectRowContext.Provider>
	);
});

export default InputSelectRow;
