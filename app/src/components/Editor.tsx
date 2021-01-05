import * as Preact from 'preact';
import type Phaser from 'phaser';
import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'preact/hooks';

import './Editor.sass';

import { ExternalData } from '../editor/EditorData';

// // Prevent scrolling hotkeys as the app implements its own scrolling.
// document.addEventListener('keydown', (e: KeyboardEvent) => {
// 	if (e.ctrlKey
// 		&&(e.which == 61  // +/= key
// 		|| e.which == 107 // Numpad +
// 		|| e.which == 173 // -/_ key
// 		|| e.which == 109 // Numpad -
// 		|| e.which == 187 // Numpad =
// 		|| e.which == 189 // Numpad -
// 	)) e.preventDefault();
// });

// window.addEventListener('wheel', (e) => {
// 	if (e.ctrlKey) e.preventDefault();
// }, { passive: false });

export default function Editor() {
	const rootRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<Phaser.Game | null>(null);

	const { campaign, map } = useParams<{ campaign: string; map: string }>();
	
	/**
	 * Lazy-load the editor, display it when ready,
	 * and destroy it when complete.
	 */

	useEffect(() => {
		let ignore = false;
		import('../editor/Main').then(({ default: create }) => {
			if (ignore || !rootRef.current) return;
			
			const data: ExternalData = {
				campaign,
				map
			};

			editorRef.current = create(rootRef.current, data);

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
	 * Block context menu on right-click within the root editor node.
	 */

	useEffect(() => {
		const blockContextMenu = (evt: Event) => {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		};

		const root = rootRef.current;
		root.addEventListener('contextmenu', blockContextMenu);
		return () => root.removeEventListener('contextmenu', blockContextMenu);
	}, []);

	return (
		<div ref={rootRef} class='Editor' />
	);
}
