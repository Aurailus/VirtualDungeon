import * as Preact from 'preact';
import { bind } from './PreactComponent';
import { useState, useEffect } from 'preact/hooks';

import './Toolbar.sass';

import DrawToolbar from './DrawToolbar';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

import { TokenModeKey } from '../../mode/TokenMode';
import ActionManager from '../../action/ActionManager';
import DrawMode, { DrawModeKey } from '../../mode/DrawMode';
import { ArchitectModeKey } from '../../mode/ArchitectMode';
import ModeManager, { ModeSwitchEvent} from '../../mode/ModeManager';

interface Props {
	mode: ModeManager;
	actions: ActionManager;
}

export default bind<Props>(function LayerManager(props: Props) {
	const [ hasPrev, setHasPrev ] = useState<boolean>(false);
	const [ hasNext, setHasNext ] = useState<boolean>(false);

	useEffect(() => {
		const actionCb = () => {
			setHasPrev(props.actions.hasPrev());
			setHasNext(props.actions.hasNext());
		};
		
		props.actions.event.bind(actionCb);
		return () => props.actions.event.unbind(actionCb);
	}, [ props.actions ]);

	const [ mode, setMode ] = useState<string>(props.mode.getActive());

	useEffect(() => {
		const modeCb = (evt: ModeSwitchEvent) => {
			setMode(evt.to);
		};

		props.mode.bind(modeCb);
		return () => props.mode.unbind(modeCb);
	});

	const handleSetMode = (mode: string) => {
		props.mode.activate(mode);
	};

	return (
		<div class='Toolbar'>
			<ButtonGroup class='Toolbar-ModeSelector'>
				{props.mode.hasMode(ArchitectModeKey) && <Button icon='architect' alt='Build Map' noFocus={true}
					inactive={mode !== ArchitectModeKey} onClick={() => handleSetMode(ArchitectModeKey)} />}
				<Button icon='token' alt='Manage Tokens' noFocus={true}
					inactive={mode !== TokenModeKey} onClick={() => handleSetMode(TokenModeKey)} />
				<Button icon='draw' alt='Draw Markup' noFocus={true}
					inactive={mode !== DrawModeKey} onClick={() => handleSetMode(DrawModeKey)} />
			</ButtonGroup>

			<div class='Toolbar-Separator' />

			<ButtonGroup>
				<Button icon='undo' alt='Undo' noFocus={true}
					disabled={!hasPrev} onClick={() => props.actions.prev()} />
				<Button icon='redo' alt='Redo' noFocus={true}
					disabled={!hasNext} onClick={() => props.actions.next()} />
			</ButtonGroup>

			<div class='Toolbar-Spacer' />

			{/* (mode !== DrawModeKey) &&
				<Preact.Fragment>
					<ButtonGroup>
						<Button icon='ruler' alt='Measure Distance'
							noFocus={true} inactive={true} />

						<Button icon='circle' alt='Measure Circle'
							noFocus={true} inactive={true} />

						<Button icon='cone' alt='Measure Cone'
							noFocus={true} inactive={true} />

					</ButtonGroup>
					<div class='Toolbar-Spacer' />
				</Preact.Fragment>
			*/}

			{mode === TokenModeKey &&
				<Preact.Fragment>
					<Button icon='rectangle_select' alt='Rectangle Select' noFocus={true} />
				</Preact.Fragment>
			}

			{mode === DrawModeKey &&
				<DrawToolbar mode={props.mode.getActiveInstance() as DrawMode} />
			}
		</div>
	);
});
