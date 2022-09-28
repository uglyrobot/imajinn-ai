import { Button } from '@wordpress/components';
import { gallery } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';

const VariationsButton = ( props ) => {
	let url = props.generations[ props.genindex ].jpg;

	return (
		<Button
			icon={ gallery }
			label={ __( 'Generate Variations', 'imajinn-ai' ) }
			onClick={ () => {
				props.setRatio( props.queryRatio );
				props.startJob( url, null, props.queryRatio );
			} }
		/>
	);
};

export default VariationsButton;
