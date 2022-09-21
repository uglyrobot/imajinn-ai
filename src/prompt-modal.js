import { __ } from '@wordpress/i18n';
import { Button, Icon, Modal, Dashicon, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';

export function PromptModal( props ) {
	const [ isOpen, setOpen ] = useState( false );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ prompts, setPrompts ] = useState( [] );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	const createPrompts = async ( prompt ) => {
		setIsSubmitting( true );

		//save the attachment
		const response = await fetch(
			`${ ajaxurl }?action=imajinn-create-prompts`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					prompt: prompt,
					nonce: IMAJINN.nonce,
				} ),
			}
		);
		const result = await response.json();
		setIsSubmitting( false );
		if ( result.success ) {
			console.log( result.data.prompts )
			setPrompts( result.data.prompts );
			openModal();
		}

		return false;
	};

	return (
		<>
			<Button
				disabled={ isSubmitting }
				variant="secondary"
				className="prompt-creator"
				onClick={ () => {
					createPrompts( props.prompt )
				} }
				icon={ isSubmitting ? <Spinner /> : <Dashicon icon="art" /> }
				>
				{ __( 'Prompt Bot', 'imajinn-ai' ) }
				</Button>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ closeModal }
					style={ { maxWidth: '800px' } }
					icon={ <Dashicon icon="art" /> }
					title={ __( 'AI Generated Prompt Ideas', 'imajinn-ai' ) }
				>

					<Button variant="secondary" onClick={ closeModal }>
						{ __( 'Cancel', 'imajinn-ai' ) }
					</Button>
				</Modal>
			) }
		</>
	);
}
