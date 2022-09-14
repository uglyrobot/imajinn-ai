import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';
import Editor from './editor-main';

import './editor-styles.scss';

domReady( function () {
	const settings = {};
	//registerCoreBlocks();
	render(
		<Editor settings={ settings } />,
		document.getElementById( 'imajinn-block-editor' )
	);
} );
