import * as Preact from 'preact';
import type Phaser from 'phaser';
import { useState, useEffect, useRef } from 'preact/hooks';

import './Editor.sass';

interface Props {
	user: string;
	identifier: string;
	mapIdentifier?: string;
}

function pad(n: number) {
	if (n < 10) return '0' + n;
	return '' + n;
}

export default function Editor({ user, identifier, mapIdentifier }: Props) {
	const rootRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<Phaser.Game | null>(null);
	const [ loadPercent, setLoadPercent ] = useState<number | undefined>(0);

	/**
	 * Lazy-load the editor, display it when ready,
	 * and destroy it when complete.
	 */

	useEffect(() => {
		let ignore = false;
		import('../editor/Main').then(({ default: create }) => {
			setLoadPercent(0.25);
			if (ignore || !rootRef.current) return;

			editorRef.current = create(rootRef.current, setLoadPercent, user, identifier, mapIdentifier);

			const resizeCallback = () => {
				const { width, height } = rootRef.current.getBoundingClientRect();
				editorRef.current!.scale.resize(width, height);
			};

			window.addEventListener('resize', resizeCallback);
			return () => window.removeEventListener('resize', resizeCallback);
		});

		return () => {
			ignore = true;
			if (!editorRef.current) return;
			editorRef.current.destroy(true);
			editorRef.current = null;
		};
	}, []);

	/**
	 * Cancel Zoom buttons zooming the browser window.
	 * Browser zoom can still be applied through the browser's context menu.
	 */

	useEffect(() => {
		const cancelZoom = (e: KeyboardEvent) => {
			if (e.ctrlKey
				&&(e.which === 61  // +/= key
				|| e.which === 107 // Numpad +
				|| e.which === 173 // -/_ key
				|| e.which === 109 // Numpad -
				|| e.which === 187 // Numpad =
				|| e.which === 189 // Numpad -
				)) e.preventDefault();
		};

		document.addEventListener('keydown', cancelZoom);
		return () => document.removeEventListener('keydown', cancelZoom);
	}, []);

	return (
		<div ref={rootRef} class='Editor'>
			{loadPercent !== undefined &&
				<div class='Editor-Loader'>
					<div class='Editor-LoaderContainer'>
					 	<img class='Editor-LoaderBar' src='/app/static/load/loader_filled.png'
					 		alt={Math.round(loadPercent * 100) + '%'}
					 		style={{ clipPath: `inset(${Math.round((1 - loadPercent) * 100)}% 0 0 0)`}}
					 		aria-role='progressbar' aria-valuemin='0' aria-valuemax='1' aria-valuenow={loadPercent} />
			 		</div>
					<p class='Editor-LoaderText'><small>Loading… </small>{pad(Math.round(loadPercent * 100))}%</p>
				</div>
			}
		</div>
	);
}
