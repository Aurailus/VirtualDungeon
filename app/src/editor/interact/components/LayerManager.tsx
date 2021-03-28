import * as Preact from 'preact';
import { bind } from './PreactComponent';
import { useState } from 'preact/hooks';

import './LayerManager.sass';

import LayerMenu from './LayerMenu';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

import Map from '../../map/Map';
import MapLayer from '../../map/MapLayer';

interface LayerProps {
	layer: MapLayer;
	active: boolean;
	onClick: () => void;
	onEdit: () => void;
}

function Layer({ layer, active, onEdit, onClick }: LayerProps) {
	const handleFocus = (e: any) => e.target.blur();

	const handleEdit = () => {
		onClick();
		onEdit();
	};

	return (
		<button class={('LayerManager-Layer ' + (active ? 'Active' : '')).trim()}
			onClick={onClick} onContextMenu={handleEdit} onFocus={handleFocus}>
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

	const [ visibility, setVisibility ] = useState<'collapsed' | 'side' | 'full'>('collapsed');
	const active = map.getActiveLayer();
	
	const handleCollapse = () => {
		setVisibility(visibility === 'collapsed' ? 'side' : 'collapsed');
	};

	const handleAddLayer = () => {
		map.addLayer();
		setLayers([ ...map.getLayers() ]);
		setActiveLayer(map.getActiveLayer()?.index);
	};
	
	const handleRemoveLayer = () => {
		if (!map.getActiveLayer()) return;
		map.removeLayer(map.getActiveLayer()!.index);
		setLayers([ ...map.getLayers() ]);
		setActiveLayer(map.getActiveLayer()?.index);
	};

	const handleClickLayer = (index: number) => {
		map.setActiveLayer(index);
		setActiveLayer(index);
	};

	const handleEditLayer = () => {
		setVisibility(visibility === 'full' ? 'side' : 'full');
	};

	const handleSetName = (name: string) => {
		active!.name = name;
		setLayers([ ...map.getLayers() ]);
	};

	const handleMoveLayer = (off: number) => {
		console.log(off);
	};

	return (
		<div class={'LayerManager ' + visibility}>
			<div class='LayerManager-Layers'>
				<ButtonGroup>
					{visibility !== 'collapsed' && <Preact.Fragment>
						<Button icon='add' alt='Add Layer' onClick={handleAddLayer} noFocus />
						<Button icon='remove' alt='Remove Layer' onClick={handleRemoveLayer} disabled={activeLayer === undefined} noFocus />
						<Button icon='edit' alt='Edit Layer' onClick={handleEditLayer} disabled={activeLayer === undefined} noFocus />
					</Preact.Fragment>}
					<Button icon={visibility === 'collapsed' ? 'nav_left' : 'nav_right'} alt='Collapse Panel'
						noFocus onClick={handleCollapse} />
				</ButtonGroup>
				{layers.map(l => <Layer layer={l} active={activeLayer === l.index}
					onClick={() => handleClickLayer(l.index)} onEdit={handleEditLayer} />)}
			</div>
			{visibility === 'full' && active && <Preact.Fragment>
				<div class='LayerManager-Separator' />
				<LayerMenu
					visibility={'visible'}
					onVisibility={console.log}
					name={active.name}
					onName={handleSetName}
					canMoveUp={active.index > 0}
					canMoveDown={active.index < map.getLayers().length - 1}
					onMove={handleMoveLayer}
				/>
			</Preact.Fragment>}
		</div>
	);
});
