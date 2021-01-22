import * as Preact from 'preact';
import { bind } from './PreactComponent';
import { useState } from 'preact/hooks';

import './LayerManager.sass';

import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

import Map from '../../map/Map';
import MapLayer from '../../map/MapLayer';

interface LayerProps {
	layer: MapLayer;
	active: boolean;
	onClick: () => void;
}

function Layer({ layer, active, onClick }: LayerProps) {
	const handleFocus = (e: any) => e.target.blur();

	return (
		<button class={('LayerManager-Layer ' + (active ? 'Active' : '')).trim()} onClick={onClick} onFocus={handleFocus}>
			<p>{layer.name}</p>
		</button>
	);
}


interface Props {
	map: Map;
}

export default bind<Props>(function LayerManager({ map }: Props) {
	const [ layers, setLayers ] = useState<MapLayer[]>([ ...map.getLayers() ]);
	const [ activeLayer, setActiveLayer ] = useState<number | undefined>(map.getActiveLayer()?.index);
	
	const handleAddLayer = () => {
		map.addLayer();
		setLayers([ ...map.getLayers() ]);
		setActiveLayer(map.getActiveLayer()?.index);
	};
	
	const handleRemoveLayer = () => {
		// map.removeLayer(i);
		setLayers([ ...map.getLayers() ]);
		setActiveLayer(map.getActiveLayer()?.index);
	};

	const handleClickLayer = (index: number) => {
		map.setActiveLayer(index);
		setActiveLayer(index);
	};

	return (
		<div class='LayerManager'>
			<ButtonGroup>
				<Button icon='nav_down' alt='Move layer down' disabled={activeLayer === 0} noFocus />
				<Button icon='nav_up' alt='Move layer up' disabled={activeLayer === layers.length - 1} noFocus />
				<Button icon='remove' alt='Remove layer' onClick={handleRemoveLayer} noFocus />
				<Button icon='add' alt='Add layer' onClick={handleAddLayer} noFocus />
			</ButtonGroup>
			{layers.map(l => <Layer layer={l} active={activeLayer === l.index} onClick={() => handleClickLayer(l.index)} />)}
		</div>
	);
});
