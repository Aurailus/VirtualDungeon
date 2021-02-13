import * as Preact from 'preact';

import './TokenCard.sass';

import TokenSlider from './TokenSlider';
import Text from '../../../components/input/fields/InputText';
import { TokenSliderData, TokenMetaData } from '../../map/token/Token';

import { Asset } from '../../../../../common/DBStructs';

interface TokenCardProps extends TokenMetaData {
	assets: Asset[];
	pinned: boolean;

	setProps: (data: Partial<TokenMetaData>) => void;
	setPinned: (pinned: boolean) => void;
}

export default function TokenCard(props: TokenCardProps) {
	const icon: string = '';
	 // props.assets.filter(a => a.identifier === props.appearance.sprite)[0];
	const scale = 4;
	// icon.dimensions!.x / icon.tileSize;

	const handleAddSlider = () => {
		props.setProps({ sliders: [
			...props.sliders,
			{ name: 'Untitled',  color: { h: .95, s: .59, v: .94 }, max: 10, current: 10, icon: 1 }
		]});
	};

	const handleUpdateSlider = (ind: number, data: Partial<TokenSliderData>) => {
		const newSliders: TokenSliderData[] = [ ...props.sliders ];
		newSliders[ind] = { ...newSliders[ind], ...data };
		props.setProps({ sliders: newSliders });
	};

	const handleTogglePin = (e: MouseEvent) => {
		props.setPinned(!props.pinned);
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
							backgroundImage: `url("/app/asset/${icon}")`,
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
