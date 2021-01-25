import * as Preact from 'preact';
import { useState, useEffect, useLayoutEffect, useRef } from 'preact/hooks';

import './TokenSlider.sass';

import { TokenSliderData } from '../../map/token/Token';

import { clamp } from '../../util/Helpers';

function SliderNumericInput(props: { min: number; max: number;
	value: number; setValue: (val: number) => void; class?: string; }) {

	const [ value, setValue ] = useState<string>(props.value + '');
	useEffect(() => { if ((value === '') !== (props.value === 0)) setValue(props.value + ''); }, [ props.value ]);

	const ref = useRef<HTMLSpanElement>(null);
	const [ width, setWidth ] = useState<number>(0);
	useLayoutEffect(() => setWidth(ref.current!.getBoundingClientRect().width), [ value ]);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			const newValue = clamp(props.value + (e.key === 'ArrowUp' ? 1 : -1) *
				(e.ctrlKey ? 5 : 1) * (e.shiftKey ? 10 : 1), props.min, props.max);
			props.setValue(newValue);
			setValue(newValue + '');

			e.preventDefault();
			e.stopPropagation();
		}
	};

	const handleInput = (e: any) => {
		setValue(e.target.value);
		const numeric = Number.parseInt(e.target.value, 10);
		props.setValue(Number.isNaN(numeric) ? 0 : numeric);
	};

	const handleBlur = () => setValue(props.value + '');

	return (
		<Preact.Fragment>
			<input type='text' class={props.class} style={{ width: width + 'px' }} value={value}
				onKeyDown={handleKeyDown} onInput={handleInput} onChange={handleInput} onBlur={handleBlur} />
			<span ref={ref} class={('SlideNumericInput-Tester ' + (props.class ?? '')).trim()}>{value}</span>
		</Preact.Fragment>
	);
}

interface Props extends TokenSliderData {
	setProps: (data: Partial<TokenSliderData>) => void;
}

export default function TokenSlider(props: Props) {
	const handleChangeName = (e: any) => {
		const name: string = e.target.value;
		props.setProps({ name });
	};

	return (
		<div class='TokenSlider'>
			<div class='TokenSlider-IconWrap'>
				<div class='TokenSlider-Icon' style={{ backgroundPosition: `${(props.icon || 0) * (100 / 8)}% 0`}} />
			</div>
			<div class='TokenSlider-Slider'>
				<div class='TokenSlider-SliderInner'>
					<div class='TokenSlider-Bar' style={{ backgroundColor: props.color ?? '#f06292',
						width: 'calc(' + ((props.current - (props.min || 0)) / props.max) * 100 + '% - 6px)'}}/>
					<div class='TokenSlider-BarContent'>
						<input class='TokenSlider-Input TokenSlider-BarText TokenSlider-Title'
							value={props.name} onChange={handleChangeName}/>

						<SliderNumericInput class='TokenSlider-Input TokenSlider-BarText' value={props.current}
							min={props.min ?? 0} max={props.max} setValue={current => props.setProps({ current })} />
						<span class='TokenSlider-BarText'>/</span>
						<SliderNumericInput class='TokenSlider-Input TokenSlider-BarText' value={props.max}
							min={0} max={Number.POSITIVE_INFINITY} setValue={max => props.setProps({ max })} />
					</div>
				</div>
			</div>
		</div>
	);
}
