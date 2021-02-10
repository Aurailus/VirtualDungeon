import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';

import './ColorPicker.sass';

import { WidgetProps } from './Input';

import * as Color from '../../../../common/Color';

interface Props {
	parent?: HTMLElement;
	writable?: boolean;
	showHex?: boolean;
}

const ColorPicker = forwardRef<HTMLDivElement, WidgetProps & Props>((props, ref) => {
	const color = props.value ? typeof props.value === 'string' ? Color.hexToHSV(props.value) : props.value : { h: 0, s: 0, v : 0};

	const mouseTarget = useRef<string>('');
	const satValElem = useRef<HTMLDivElement>(null);
	const hueElem = useRef<HTMLDivElement>(null);

	const inputHex = (evt: any) => {
		const val = evt.target.value;
		if (val.length !== 7) return;
		props.setValue(Color.hexToHSV(val));
	};

	const handleHueMove = (evt: MouseEvent) => {
		const bounds = hueElem.current.getBoundingClientRect();
		const hue = Math.max(Math.min((evt.clientX - bounds.left) / bounds.width, 1), 0);
		props.setValue({ ...color, h: hue });
	};

	const handleSatValMove = (evt: MouseEvent) => {
		const bounds = satValElem.current.getBoundingClientRect();
		const sat = Math.max(Math.min((evt.clientX - bounds.left) / bounds.width, 1), 0);
		const val = Math.max(Math.min((bounds.bottom - evt.clientY) / bounds.height, 1), 0);
		props.setValue({ ...color, s: sat, v: val });
	};

	const handleMouseMove = (evt: MouseEvent) => {
		switch (mouseTarget.current) {
		default: return;
		case 'hue': return handleHueMove(evt);
		case 'satval': return handleSatValMove(evt);
		}
	};

	const handleMouseClick = (evt: MouseEvent, target: string) => {
		evt.stopImmediatePropagation();
		evt.preventDefault();

		mouseTarget.current = target;
		handleMouseMove(evt);
	};

	useEffect(() => {
		const clearMouse = () => mouseTarget.current = '';
		document.body.addEventListener('mouseup', clearMouse);
		document.body.addEventListener('mousemove', handleMouseMove);
		return () => {
			document.body.removeEventListener('mouseup', clearMouse);
			document.body.removeEventListener('mousemove', handleMouseMove);
		};
	}, [ handleMouseMove ]);

	const hueHex = Color.HSVToHex({ h: color.h, s: 1, v: 1 });
	const fullHex = Color.HSVToHex(color);

	const style: any = {};
	if (props.parent) {
		style.top = props.parent.getBoundingClientRect().bottom + 'px';
		style.left = ((props.parent.getBoundingClientRect().left +
			props.parent.getBoundingClientRect().right) / 2) + 'px';
	}

	return (
		<div class={('ColorPicker ' + (props.writable ? 'Write ' : '' + (props.parent ? 'Absolute' : ''))).trim()}
			ref={ref} style={style}>
			
			<div class='ColorPicker-SatVal' ref={satValElem}
				onMouseDown={(evt) => handleMouseClick(evt, 'satval')}
				style={{ backgroundColor: hueHex }}>

				{props.showHex && <p class='ColorPicker-Hex'>{fullHex}</p>}

				<div class='ColorPicker-Indicator' style={{ left: (color.s * 100) + '%',
					top: ((1 - color.v) * 100) + '%', backgroundColor: fullHex }} />

			</div>
			<div class='ColorPicker-Separator' />
			<div class='ColorPicker-Hue' ref={hueElem}
				onMouseDown={(evt) => handleMouseClick(evt, 'hue')}>
				<div class='ColorPicker-Indicator' style={{ left: (color.h * 100) + '%', backgroundColor: hueHex }} />
			</div>
			{props.writable && <div class='ColorPicker-Details'>
				<div class='ColorPicker-ColorBlock' style={{ backgroundColor: fullHex }} />
				<input class='ColorPicker-ColorInput' value={fullHex} onChange={inputHex} onInput={inputHex} maxLength={7} />
			</div>}
		</div>
	);
});

export default ColorPicker;
