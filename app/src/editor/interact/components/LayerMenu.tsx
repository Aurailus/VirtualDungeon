import * as Preact from 'preact';

import './LayerMenu.sass';

import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

import { Text as InputText } from '../../../components/input/Input';

interface Props {
	name: string;
	
	canMoveUp: boolean;
	canMoveDown: boolean;
	handleMove: (off: number) => void;
}

export default function TokenCard(props: Props) {
	return (
		<div class='LayerMenu'>
			<div class='LayerMenu-Top'>
				<InputText value={props.name} setValue={() => {/* Not yet implemented.*/}} />
				<div class='LayerMenu-Actions'>
					<ButtonGroup>
						<Button icon='nav_up' alt='Move up' disabled={!props.canMoveUp} />
						<Button icon='nav_down' alt='Move down' disabled={!props.canMoveDown} />
					</ButtonGroup>
				</div>
			</div>
		</div>
	);
}
