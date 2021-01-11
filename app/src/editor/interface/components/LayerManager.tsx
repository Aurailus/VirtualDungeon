import * as Preact from 'preact';
import { bind } from './PreactComponent';
import { useState } from 'preact/hooks';

import './LayerManager.sass';

import Button from '../../../components/Button';

import Map from '../../map/Map';
import MapLayer from '../../map/MapLayer';

interface LayerProps {
	layer: MapLayer;
	active: boolean;
	onClick: () => void
}

function Layer({ layer, active, onClick }: LayerProps) {
	return (
		<button class={('LayerManager-Layer ' + (active ? 'Active' : '')).trim()} onClick={onClick}>
			<p>Layer {layer.index}</p>
		</button>
	);
}


interface Props {
	map: Map;
}

export default bind<Props>(function LayerManager({ map }: Props) {
	const [ layers, setLayers ] = useState<MapLayer[]>([ ...map.getLayers() ]);
	const [ activeLayer, setActiveLayer ] = useState<number | undefined>(map.activeLayer?.index);
	
	const handleAddLayer = () => {
		map.addLayer();
		setLayers([ ...map.getLayers() ]);
		setActiveLayer(map.activeLayer?.index);
	};

	const handleClickLayer = (index: number) => {
		console.log('aaa', index);
		map.activeLayer = map.getLayers()[index];
		setActiveLayer(index);
	}

	return (
		<div class='LayerManager'>
			{layers.map(l => <Layer layer={l} active={activeLayer === l.index} onClick={() => handleClickLayer(l.index)} />).reverse()}
			<Button label='hi!' onClick={handleAddLayer} />
		</div>
	);
});