/**
 * WordPress dependencies
 */
import { SlotFillProvider } from '@wordpress/components';
import { InterfaceSkeleton, FullscreenMode } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import Notices from './components/notices';
import Header from './components/header';
import Sidebar from './components/sidebar';
import BlockEditor from './components/block-editor';

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
