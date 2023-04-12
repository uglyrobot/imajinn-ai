import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import Editor from './editor/index';

import './editor/styles.scss';

domReady( function () {
	const settings = {};
	const root = createRoot(
		document.getElementById( 'imajinn-block-editor' )
	);
	root.render( <Editor settings={ settings } /> );
} );
