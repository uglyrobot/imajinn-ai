import { __, _x } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { close } from '@wordpress/icons';
import { HelpModal } from '../../help';
const TopRight = ( { deleteBlock } ) => (
	<div className="corner-controls">
		<HelpModal />
		<Button
			className="imajinn-close-button"
			icon={ close }
			label={ __( 'Close Imajinn Block', 'imajinn-ai' ) }
			onClick={ () => {
				deleteBlock();
			} }
		/>
	</div>
);

export default TopRight;
