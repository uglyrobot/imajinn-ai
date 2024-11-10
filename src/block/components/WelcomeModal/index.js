import { __, _x } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { Genie } from '../images/images';
import { useState, useEffect } from '@wordpress/element';
import { HelpModal, PromptHelpModal } from '../help-modals';
import './styles.scss';

export function WelcomeModal( { showWelcome, setShowWelcome, ...props } ) {
	const [ isOpen, setOpen ] = useState( showWelcome );

	const closeModal = async () => {
		setShowWelcome( false );

		//save the user flag so they don't see this again
		const response = await fetch(
			`${ ajaxurl }?action=imajinn-dismiss-welcome`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					nonce: IMAJINN.nonce,
				} ),
			}
		);
		const result = await response.json();
		if ( result.success ) {
			IMAJINN.show_welcome = false;
			return true;
		}

		return false;
	};

	useEffect( () => {
		setOpen( showWelcome );
	}, [ showWelcome ] );

	return (
		<>
			{ isOpen && (
				<Modal
					{ ...props }
					isDismissible={ false }
					style={ { maxWidth: '900px' } }
					icon={ <Genie iconSize={ 20 } /> }
					title={ __( 'Getting Started', 'imajinn-ai' ) }
				>
					<p>
						{ __(
							'Welcome to Imajinn! Here are some quick tips to get you started so you can create the best images possible.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Do:', 'imajinn-ai' ) }</h3>
					<ol>
						<li>
							{ __(
								'Write a detailed and descriptive prompt in English.',
								'imajinn-ai'
							) }
							<PromptHelpModal />
						</li>
						<li>
							{ __(
								'Use our style dropdowns for the best results.',
								'imajinn-ai'
							) }
						</li>
						<li>
							{ __(
								'Only use 3:2 or 2:3 ratios to generate images with smaller or multiple details, not a single object.',
								'imajinn-ai'
							) }
						</li>
						<li>
							{ __(
								'Think like the AI not a human: What text would you find online associated with the image you want to create?',
								'imajinn-ai'
							) }
						</li>
					</ol>

					<h3>{ __( 'Do Not:', 'imajinn-ai' ) }</h3>
					<ol>
						<li>
							{ __(
								'Try to generate photo-realistic human fingers, arms, or legs, they will often look deformed.',
								'imajinn-ai'
							) }
						</li>
						<li>
							{ __(
								'Expect to be able to create legible words, text, or logos. Text longer than a simple word will usually be gibberish.',
								'imajinn-ai'
							) }
						</li>
						<li>
							{ __(
								'Write your prompts in a language other than English. Sorry, the model was trained on primarily English image descriptions (automatic translation coming soon).',
								'imajinn-ai'
							) }
						</li>
					</ol>

					<div className="imajinn-starting-modal-buttons">
						<Button variant="primary" onClick={ closeModal }>
							{ __( 'Got it!', 'imajinn-ai' ) }
						</Button>
						<HelpModal />
					</div>
				</Modal>
			) }
		</>
	);
}

export default WelcomeModal;
