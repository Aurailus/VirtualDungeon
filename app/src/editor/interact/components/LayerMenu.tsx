import * as Preact from 'preact';

import './LayerMenu.sass';

import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

import { Text, Label, SelectRow, SelectRowItem } from '../../../components/input/Input';

interface Props {
	name: string;
	onName: (name: string) => void;

	visibility: 'hidden' | 'shadow' | 'visible';
	onVisibility: (visiblity: 'hidden' | 'shadow' | 'visible') => void;
	
	canMoveUp: boolean;
	canMoveDown: boolean;
	onMove: (off: number) => void;
}

export default function TokenCard(props: Props) {
	return (
		<div class='LayerMenu'>
			<div class='LayerMenu-Top'>
				<Text value={props.name} setValue={props.onName} />
				<div class='LayerMenu-Actions'>
					<ButtonGroup>
						<Button icon='nav_up' alt='Move layer up' disabled={!props.canMoveUp} onClick={() => props.onMove(-1)} />
						<Button icon='nav_down' alt='Move layer down' disabled={!props.canMoveDown} onClick={() => props.onMove(1)} />
					</ButtonGroup>
				</div>
			</div>
			<Label label='Layer Visibility' />
			<SelectRow value={props.visibility} setValue={props.onVisibility}>
				<SelectRowItem name='hidden' label='Hidden' />
				<SelectRowItem name='shadow' label='Shaded' />
				<SelectRowItem name='visible' label='Visible' />
			</SelectRow>
		</div>
	);
}
