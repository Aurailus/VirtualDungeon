import * as Preact from 'preact';
// import { Color } from 'auriserve-api';
import { forwardRef } from 'preact/compat';
import { useState, useRef } from 'preact/hooks';
// import { usePopupCancel } from '../../../Hooks';

import './InputColor.sass';

// import Popup from '../../Popup';
// import InputText from './InputText';
// import ColorPicker from '../ColorPicker';

import { WidgetProps } from '../Input';

interface Props {
	writable?: boolean;
	displayHex?: boolean;
	full?: boolean;
}

const InputColor = forwardRef<HTMLInputElement, Props & WidgetProps>((props, _fRef) => {
	const inputRef = useRef<HTMLDivElement>(null);
	const [ /* pickerActive */, setPickerActive ] = useState(false);

	// usePopupCancel(inputRef, () => setPickerActive(false));

	return (
		<div class={('InputColor ' + (props.full ? 'Full ' : '') + (props.class ?? '')).trim()}
			style={props.style} onFocusCapture={() => setPickerActive(true)} ref={inputRef}>
			{/* <InputText
				ref={fRef}
				value={Color.HSVToHex(props.value)}
				setValue={hex => props.setValue(Color.hexToHSV(hex))}
				max={7}
			/>
			<div class='InputColor-ColorIndicator' style={{ backgroundColor: Color.HSVToHex(props.value) }}/>
			<Popup active={pickerActive} defaultAnimation={true}>
				<ColorPicker {...props} parent={inputRef.current} />
			</Popup>*/}
		</div>
	);
});

export default InputColor;
