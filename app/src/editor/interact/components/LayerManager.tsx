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
	const [ editing, setEditing ] = useState<boolean>(false);
	const [ collapsed, setCollapsed ] = useState<boolean>(true);
	const [ layers, setLayers ] = useState<MapLayer[]>([ ...map.getLayers() ]);
	const [ activeLayer, setActiveLayer ] = useState<number | undefined>(map.getActiveLayer()?.index);
	
	const handleCollapse = () => {
		setCollapsed(!collapsed);
		if (!collapsed) setEditing(false);
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
		setEditing(!editing);
		if (!editing) setCollapsed(false);
	};

	const active = map.getActiveLayer();

	return (
		<div class={('LayerManager ' + (collapsed ? 'Collapsed' : '')).trim()}>
			{editing && active && <LayerMenu
				name={active.name}
				canMoveUp={active.index > 0}
				canMoveDown={active.index < map.getLayers().length - 1}
				handleMove={() => {/* Not yet implemented.*/}}
			/>}
			<ButtonGroup>
				{!collapsed && <Preact.Fragment>
					<Button icon='add' alt='Add Layer' onClick={handleAddLayer} noFocus />
					<Button icon='remove' alt='Remove Layer' onClick={handleRemoveLayer} disabled={activeLayer === undefined} noFocus />
					<Button icon='edit' alt='Edit Layer' onClick={handleEditLayer} disabled={activeLayer === undefined} noFocus />
				</Preact.Fragment>}
				<Button icon={collapsed ? 'nav_left' : 'nav_right'} alt='Collapse Panel'
					noFocus onClick={handleCollapse} />
			</ButtonGroup>
			{layers.map(l => <Layer layer={l} active={activeLayer === l.index}
				onClick={() => handleClickLayer(l.index)} onEdit={handleEditLayer} />)}
		</div>
	);
});
