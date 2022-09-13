/**
 * WordPress dependencies
 */
import '@wordpress/editor'; // This shouldn't be necessary
import '@wordpress/format-library';
import {useSelect, useDispatch} from '@wordpress/data';
import {useEffect, useState, useMemo} from '@wordpress/element';
import {serialize, parse} from '@wordpress/blocks';
import {uploadMedia} from '@wordpress/media-utils';
import {ShortcutProvider} from '@wordpress/keyboard-shortcuts';
import {
	Popover,
	SlotFillProvider,
} from '@wordpress/components';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	BlockTools,
	BlockInspector,
	WritingFlow,
	ObserveTyping
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Sidebar from '../sidebar';

function BlockEditor({settings: _settings}) {
	const [blocks, updateBlocks] = useState([]);
	const {createInfoNotice} = useDispatch('core/notices');

	const canUserCreateMedia = useSelect((select) => {
		const _canUserCreateMedia = select('core').canUser('create', 'media');
		return _canUserCreateMedia || _canUserCreateMedia !== false;
	}, []);

	const settings = useMemo(() => {
		if (!canUserCreateMedia) {
			return _settings;
		}
		return {
			..._settings
		};
	}, [canUserCreateMedia, _settings]);

	useEffect(() => {
		handleUpdateBlocks(() => {
			return [{clientId: 'aec86a71-20ed-4e6a-82c0-9be5fa3dee49', name: 'infinite-uploads/imajinn-ai', isValid: true, attributes: {}, innerBlocks: []}]
		});
	}, []);

	/**
	 * Wrapper for updating blocks. Required as `onInput` callback passed to
	 * `BlockEditorProvider` is now called with more than 1 argument. Therefore
	 * attempting to setState directly via `updateBlocks` will trigger an error
	 * in React.
	 */
	function handleUpdateBlocks(blocks) {
		updateBlocks(blocks);
	}

	return (
		<div className="imajinn-block-editor">
			<ShortcutProvider>
				<BlockEditorProvider
					value={blocks}
					settings={settings}
				>
					<Sidebar.InspectorFill>
						<BlockInspector/>
					</Sidebar.InspectorFill>
					<div className="editor-styles-wrapper">
						<BlockEditorKeyboardShortcuts/>
						<SlotFillProvider>
							<BlockTools>
								<WritingFlow>
									<ObserveTyping>
										<BlockList className="imajinn-block-editor__block-list"/>
									</ObserveTyping>
								</WritingFlow>
							</BlockTools>
							<Popover.Slot/>
						</SlotFillProvider>
					</div>
				</BlockEditorProvider>
			</ShortcutProvider>
		</div>
	);
}

export default BlockEditor;

