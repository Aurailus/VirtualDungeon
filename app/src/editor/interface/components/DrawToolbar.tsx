import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';

import './DrawToolbar.sass';

import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

import DrawMode, { DrawModeTool, DrawModeEvent } from '../../mode/DrawMode';

interface Props {
	mode: DrawMode;
}

export default function DrawToolbar(props: Props) {
	const [ tool, setTool ] = useState<DrawModeTool>(props.mode.getTool());

	useEffect(() => {
		const actionCb = (evt: DrawModeEvent) => {
			setTool(evt.currentTool);
		};
		
		props.mode.bind(actionCb);
		return () => props.mode.unbind(actionCb);
	}, [ props.mode ]);

	return (
		<Preact.Fragment>
			<ButtonGroup>
				<Button icon='line' alt='Draw Line Art' onClick={() => props.mode.setTool('line')}
					noFocus={true} inactive={tool !== 'line'} />

				<Button icon='tile' alt='Highlight Tiles' onClick={() => props.mode.setTool('tile')}
					noFocus={true} inactive={tool !== 'tile'} />

				<Button icon='circle' alt='Highlight Circle' onClick={() => props.mode.setTool('circle')}
					noFocus={true} inactive={tool !== 'circle'} />

				<Button icon='cone' alt='Highlight Cone' onClick={() => props.mode.setTool('cone')}
					noFocus={true} inactive={tool !== 'cone'} />
			</ButtonGroup>
		</Preact.Fragment>
	);
};
