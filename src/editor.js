import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import Editor from './editor/index';

import './editor/styles.scss';

domReady( function () {
	const settings = {};
	render(
		<Editor settings={ settings } />,
		document.getElementById( 'imajinn-block-editor' )
	);
} );
