import { __, _x } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { cloud } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
import './styles.scss';

export function UpgradeModal( props ) {
	const [ isOpen, setOpen ] = useState( props.showUpgrade );
	const closeModal = () => {
		setOpen( false );
		props.setShowUpgrade( false );
	};

	useEffect( () => {
		setOpen( props.showUpgrade );
	}, [ setOpen, props ] ); // <-- here put the parameter to listen

	return (
		<>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ closeModal }
					style={ { maxWidth: '400px' } }
					icon={ cloud }
					title={ __( 'Upgrade Plan', 'imajinn-ai' ) }
				>
					<p>
						{ __(
							'Sorry, you are out of available image generation credits. You can get more credits by upgrading your account to one of our premium plans.',
							'imajinn-ai'
						) }
					</p>

					<div className="imajinn-upgrade-modal-buttons">
						<Button
							variant="primary"
							href={ IMAJINN.checkout_url }
							target="_blank"
						>
							{ __( 'Get More Credits', 'imajinn-ai' ) }
						</Button>
						<Button variant="secondary" onClick={ closeModal }>
							{ _x(
								'Cancel',
								"Don't upgrade now",
								'imajinn-ai'
							) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
}

export default UpgradeModal;
