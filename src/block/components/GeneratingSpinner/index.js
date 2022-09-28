import { __, _x, sprintf } from '@wordpress/i18n';
import { ImajinnSpinner } from '../images/images';
import { __experimentalText as Text, Button } from '@wordpress/components';
const GeneratingSpinner = ( { status, progress, cancelJob } ) => {
	const label =
		'processing' === status
			? sprintf( __( 'Generating %s%%', 'imajinn-ai' ), progress )
			: __( 'Queued', 'imajinn-ai' );

	return (
		<div className="imajinn-loading">
			<ImajinnSpinner />
			<div>
				<Text>{ label }</Text>
				<Button
					isDestructive
					variant="link"
					onClick={ () => {
						cancelJob();
					} }
				>
					{ __( 'Cancel' ) }
				</Button>
			</div>
		</div>
	);
};

export default GeneratingSpinner;
