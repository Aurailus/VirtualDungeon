import * as Preact from 'preact';
import { bind } from './PreactComponent';
import { useState, useEffect, useLayoutEffect, useRef } from 'preact/hooks';

import './TokenCards.sass';

import Map from '../../map/Map';
import Text from '../../../components/input/fields/InputText';
import { TokenSliderData, TokenData } from '../../map/token/Token';

import { Asset } from '../../util/Asset';
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

interface TokenSliderProps extends TokenSliderData {
	setProps: (data: Partial<TokenSliderData>) => void;
}

function TokenSlider(props: TokenSliderProps) {
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

interface TokenCardProps extends TokenData {
	assets: Asset[];

	setProps: (data: Partial<TokenData>) => void;
}

function TokenCard(props: TokenCardProps) {
	const icon: Asset | undefined = props.assets.filter(a => a.identifier === props.appearance.sprite)[0];
	const scale = icon.dimensions!.x / icon.tileSize;

	const handleAddSlider = () => {
		props.setProps({ sliders: [ ...props.sliders, { name: 'Untitled', max: 10, current: 10, icon: 1 } ]});
	};

	const handleUpdateSlider = (ind: number, data: Partial<TokenSliderData>) => {
		const newSliders: TokenSliderData[] = [ ...props.sliders ];
		newSliders[ind] = { ...newSliders[ind], ...data };
		props.setProps({ sliders: newSliders });
	};

	const handleTogglePin = (e: MouseEvent) => {
		props.setProps({ pinned: !props.pinned });
		if (props.pinned) (e.target as any).blur();
	};


	return (
		<div class={('TokenCard ' + (props.pinned ? 'Pinned' : '')).trim()}>
			<div class='TokenCard-Inner'>
				<button class='TokenCard-Pin'
					onClick={handleTogglePin} />
				<div class='TokenCard-Top'>
					<div class='TokenCard-Thumbnail'>
						<div class='TokenCard-ThumbnailInner' style={{
							backgroundImage: `url("/app/asset/${icon.path}")`,
							backgroundSize: (48 * scale) + 'px'
						}} />
					</div>
					<div class='TokenCard-TopDetails'>
						<h1 class='TokenCard-Name'>{props.name}</h1>
						<p class='TokenCard-Synopsis'>{props.note}</p>
					</div>
				</div>
				<div class='TokenCard-Sliders'>
					{props.sliders.map((s, i) => <TokenSlider {...s} setProps={(props) => handleUpdateSlider(i, props)} />)}
					<button class='TokenCard-NewSlider' onClick={handleAddSlider} ><span>New Slider</span></button>
				</div>
				<Text class='TokenCard-Note' long={true} minRows={2} placeholder='Enter notes here...'
					value={props.note} setValue={note => props.setProps({ note })} />
			</div>
		</div>
	);
}

interface Props {
	map: Map;
	assets: Asset[];
}

export default bind<Props>(function TokenCards({ map, assets }: Props) {
	const [ cards, setCards ] = useState<TokenData[]>(map.tokens.getTokenData());

	useEffect(() => {
		const eventCb = () => {
			setCards(JSON.parse(JSON.stringify(map.tokens.getTokenData())));
		};
		
		map.tokens.bind(eventCb);
		return () => map.tokens.unbind(eventCb);
	}, []);

	const handleSetProps = (ind: number, data: Partial<TokenData>) => {
		map.tokens.setToken({
			uuid: cards[ind].uuid,
			...data
		});
	};

	useEffect(() => {
		const fnCallback = (evt: KeyboardEvent) => {
			if (evt.key[0] !== 'F' || evt.key.length !== 2 || !(evt.key.charCodeAt(1) >= '1'.charCodeAt(0) &&
				evt.key.charCodeAt(1) <= '8'.charCodeAt(0))) return;

			evt.preventDefault();
			evt.stopPropagation();

			const ind = Number.parseInt(evt.key.substr(1), 10);
			if (cards.length >= ind) handleSetProps(ind - 1, { pinned: !cards[ind - 1].pinned });
		};

		window.addEventListener('keydown', fnCallback);
		return () => window.removeEventListener('keydown', fnCallback);
	}, [ cards ]);

	return (
		<div class='TokenCards'>
			{cards.map((c, i) => <TokenCard {...c} assets={assets} setProps={u => handleSetProps(i, u)} />)}
		</div>
	);
});
