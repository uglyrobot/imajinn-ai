/**
 * WordPress dependencies
 */
import { Popover, SlotFillProvider } from '@wordpress/components';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	BlockTools,
	BlockInspector,
	WritingFlow,
	ObserveTyping,
} from '@wordpress/block-editor';
import { InterfaceSkeleton, FullscreenMode } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import Notices from './editor-components/notices';
import Header from './editor-components/header';
import Sidebar from './editor-components/sidebar';
import BlockEditor from './editor-components/block-editor';

function Editor( { settings } ) {
	return (
		<>
			<FullscreenMode isActive={ false } />
			<SlotFillProvider>
				<InterfaceSkeleton
					header={ <Header /> }
					sidebar={ <Sidebar /> }
					content={
						<>
							<Notices />
							<BlockEditor settings={ settings } />
						</>
					}
				/>
			</SlotFillProvider>
		</>
	);
}

export default Editor;
