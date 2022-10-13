import { __ } from '@wordpress/i18n';
import { Button, Icon, Modal, Panel, PanelBody, PanelRow, Dashicon, Popover } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import './styles.scss';
import modifiers from './modifiers';

export function StylesModal( {setPromptStyle} ) {
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );



	const ModifierButton = ( { item }) => {
		const [ isVisible, setIsVisible ] = useState( false );
		const [ isInserted, setIsInserted ] = useState( false );
		const toggleVisible = () => {
			setIsVisible( ( state ) => ! state );
		};

		const insertStyle = ( style ) => {
			setPromptStyle((currentStyle) => {
					return [currentStyle, style].filter( Boolean ).join(', ');
				});
			setIsInserted( true );
		}

		return (
			<Button disabled={ isInserted } isSmall isPrimary icon={ plus } onMouseEnter={ toggleVisible } onMouseLeave={ toggleVisible } onClick={ () => insertStyle( item.modifier ) }>
				{ item.modifier }
				{ isVisible && (
					<Popover noArrow={false} placement={"bottom-start"}>
						<div style={ { display: 'flex', justifyItems: 'center', borderRadius: 5 } }>
						{ item.previews.map( ( preview, index ) => (
							<img key={ index } style={ { width: 128, height: 128, margin: 0}} src={ "https://styles.imajinn.ai/thumbs/" + preview.path }  />
						) ) }
						</div>
					</Popover>
				)}
			</Button>
		);
	};

	const panels = modifiers.map( ( cat, index ) =>
		<Panel key={index} header={ cat.category }>
		<PanelBody initialOpen={ true }>
			<PanelRow>
				{ cat.modifiers.map( ( modifier, index ) => (
					<ModifierButton key={index} item={modifier } />
				) ) }
			</PanelRow>
		</PanelBody>
		</Panel>
	);

	return (
		<>
			<Button isSecondary className="imajinn-styles-button" icon={ <Dashicon icon="art" /> } onClick={ openModal }>
				{ __( 'Style Picker', 'imajinn-ai' ) }
			</Button>
			{ isOpen && (
				<Modal
					onRequestClose={ closeModal }
					className="imajinn-styles-modal"
					icon={ <Dashicon icon="art" /> }
					title={ __( 'Style Picker', 'imajinn-ai' ) }
				>
						{ panels }
				</Modal>
			) }
		</>
	);
}

export default StylesModal;
