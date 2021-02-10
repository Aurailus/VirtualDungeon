import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';

import './DrawToolbar.sass';

import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';
import Color from '../../../components/input/fields/InputColor';

import DrawMode, { DrawModeTool, DrawModeToolEvent, DrawModeColorEvent } from '../../mode/DrawMode';

interface Props {
	mode: DrawMode;
}

export default function DrawToolbar(props: Props) {
	const [ color, setColor ] = useState<any>(props.mode.getColor());
	const [ tool, setTool ] = useState<DrawModeTool>(props.mode.getTool());

	useEffect(() => {
		const toolCb = (evt: DrawModeToolEvent) => setTool(evt.currentTool);
		const colorCb = (evt: DrawModeColorEvent) => setColor(evt.currentColor);
		
		props.mode.tool.bind(toolCb);
		props.mode.color.bind(colorCb);

		return () => {
			props.mode.tool.unbind(toolCb);
			props.mode.color.unbind(colorCb);
		};
	}, [ props.mode ]);

	return (
		<Preact.Fragment>
			<div class='Button DrawToolbar-Color'>
				<Color full showHex value={color} setValue={c => props.mode.setColor(c)} />
			</div>
			<div class='Toolbar-Spacer' />
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
