import { __ } from '@wordpress/i18n';
import { Button, BaseControl, Modal, Spinner, Panel, PanelBody, PanelRow } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Genie } from "./images";

export function PromptGenieModal( props ) {
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

			<PanelBody key={ index.toString() } opened={ true }>
				<PanelRow>
					<span><em>{ props.prompt }</em>{ item.replace( props.prompt, '' ) }</span>
					<Button
						variant="primary"
						isSmall
						className={ "genie-generate" }
						onClick={ () => {
							props.setPromptStyle( item.replace( props.prompt, '' ) )
							props.startJob( null, null, null, null, item.replace( props.prompt, '' ) );
							closeModal()
						} }
					>
						{ __( 'Generate', 'imajinn-ai' ) }
					</Button>
				</PanelRow>
			</PanelBody>
	) );

	const GenieButton = () => {
		if (isSubmitting) {
			return (
				<Button
					disabled
					icon={ <Spinner /> }
					label={ __( 'Generating prompt masterpieces...', 'imajinn-ai' ) }
				/>
			);
		} else {
			return (
				<Button
					variant="secondary"
					id="imajinn-prompt-genie-button"
					label={__('Prompt Genie: AI generated prompt masterpiece', 'imajinn-ai')}
					onClick={() => {
						if (!props.prompt) {
							props.setError(__('Please enter a prompt before summoning the prompt genie!', 'imajinn-ai'));
						} else {
							props.setError('');
							if (props.prompt === currentPrompt) {
								openModal();
							} else {
								createPrompts(props.prompt);
							}
						}

					}}
					icon={<Genie/>}
				>
					{__('Summon', 'imajinn-ai')}
				</Button>
			);
		}
	}
	return (
		<>
			<BaseControl
				label={ __( 'Prompt Genie', 'imajinn-ai' ) }
				id="imajinn-prompt-genie-button"
				className="prompt-genie"
			>
				<div>
					<GenieButton />
				</div>
			</BaseControl>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ closeModal }
					style={ { maxWidth: '90%' } }
					title={ __( 'AI Generated Prompt Ideas', 'imajinn-ai' ) }
				>
					<Panel>{ promptList }</Panel>
				</Modal>
			) }
		</>
	);
}
