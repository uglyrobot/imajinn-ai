import { __ } from '@wordpress/i18n';
import {
	Button,
	BaseControl,
	Modal,
	Spinner,
	Panel,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Genie } from '../images/images';
import './styles.scss';

export function PromptGenieModal( props ) {
	const [ isOpen, setOpen ] = useState( false );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ prompts, setPrompts ] = useState( [] );
	const [ generatedPrompts, setGeneratedPrompts ] = useState( [] );
	const [ currentPrompt, setCurrentPrompt ] = useState( null );
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
			setPrompts( result.data.prompts );
			setGeneratedPrompts( [] );
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
				<span>
					<em>{ props.prompt }</em> { item }
				</span>
				<Button
					variant="primary"
					isSmall
					disabled={ generatedPrompts.some(
						( e ) => e.index === index
					) }
					className={ 'genie-generate' }
					onClick={ () => {
						props.clearStyles();
						//if prompt was empty, then split the generated prompt into subject and style
						if ( ! props.prompt ) {
							let prompt = item.split( ',' )[ 0 ]; //get string up to first comma
							props.setPrompt( prompt );
							let promptStyle = item.split( ',' ).slice( 1 ).join(); //get entire string after first comma
							props.setPromptStyle( promptStyle );
							props.startJob( null, null, null, prompt, promptStyle );
						} else {
							props.setPromptStyle( item );
							props.startJob( null, null, null, null, item );
						}

						setGeneratedPrompts( ( generated ) => [
							...generated,
							{ index: index },
						] );
						closeModal();
					} }
				>
					{ __( 'Generate', 'imajinn-ai' ) }
				</Button>
			</PanelRow>
		</PanelBody>
	) );

	const GenieButton = () => {
		if ( isSubmitting ) {
			return (
				<Button
					disabled
					icon={ <Spinner /> }
					label={ __(
						'Generating prompt masterpieces...',
						'imajinn-ai'
					) }
				/>
			);
		} else {
			return (
				<Button
					disabled={ props.isLoading }
					variant="secondary"
					id="imajinn-prompt-genie-button"
					label={ __(
						'Prompt Genie: AI generated prompt masterpiece',
						'imajinn-ai'
					) }
					onClick={ () => {
							props.setError( '' );
							if ( props.prompt === currentPrompt ) {
								openModal();
							} else {
								createPrompts( props.prompt );
							}
					} }
					icon={ <Genie /> }
				>
					{ __( 'Summon', 'imajinn-ai' ) }
				</Button>
			);
		}
	};
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
					icon={ <Genie iconSize={ 20 } /> }
					title={ __( 'AI Generated Prompt Ideas', 'imajinn-ai' ) }
				>
					<Panel>{ promptList }</Panel>
				</Modal>
			) }
		</>
	);
}

export default PromptGenieModal;
