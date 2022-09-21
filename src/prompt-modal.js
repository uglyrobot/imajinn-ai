import { __ } from '@wordpress/i18n';
import { Button, Icon, Modal, Spinner, Panel, PanelBody, PanelRow } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Genie } from "./images";

export function PromptModal( props ) {
	const [ isOpen, setOpen ] = useState( false );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ prompts, setPrompts ] = useState( [] );
	const [ currentPrompt, setCurrentPrompt ] = useState( null );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	const createPrompts = async ( prompt ) => {
		setIsSubmitting( true );
		props.clearStyles();

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
			setPrompts( result.data.prompts );
			setCurrentPrompt( prompt );
			openModal();
		} else {
			props.setError( result.data[ 0 ].message );
			closeModal();
		}

		return false;
	};

	const promptList = prompts.map( ( item, index ) => (

			<PanelBody  key={ index.toString() } opened={ true }>
				<PanelRow>
					<span><em>{ props.prompt }</em>{ item.replace( props.prompt, '' ) }</span>
					<Button
						variant="primary"
						isSmall
						className={ "genie-generate" }
						onClick={ () => {
							props.setPromptStyle( item )
							//props.setPrompt( item )
							props.startJob( null, null, null, item );
							closeModal()
						} }
					>
						{ __( 'Generate', 'imajinn-ai' ) }
					</Button>
				</PanelRow>
			</PanelBody>
	) );

	return (
		<>
			<Button
				disabled={ isSubmitting }
				className="prompt-genie"
				label={ __( 'Prompt Genie: AI generated prompt masterpiece', 'imajinn-ai' ) }
				onClick={ () => {
					if ( ! props.prompt ) {
						props.setError( __( 'Please enter a prompt subject before using the prompt genie', 'imajinn-ai' ) );
					} else {
						props.setError( '' );
						if ( props.prompt === currentPrompt ) {
							openModal();
						} else {
							createPrompts( props.prompt );
						}
					}

				} }
				icon={ isSubmitting ? <Spinner /> : <Genie /> }
				/>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ closeModal }
					style={ { maxWidth: '900px' } }
					icon={ <Genie /> }
					title={ __( 'AI Generated Prompt Ideas', 'imajinn-ai' ) }
				>
					<Panel>{ promptList }</Panel>
				</Modal>
			) }
		</>
	);
}
