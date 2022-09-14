/**
 * External Dependencies
 */
const path = require( 'path' );

/**
 * WordPress Dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );

module.exports = {
	...defaultConfig,
	...{
		entry: {
			block: path.resolve( process.cwd(), 'src', 'index.js' ),
			editor: path.resolve( process.cwd(), 'src', 'editor-index.js' ),
		},
	},
};
