import { useState, useEffect } from 'react';
import { Button, Spinner } from '@wordpress/components';
import { check, upload } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';
const SaveButton = ( props ) => {
	const [ isSaving, setIsSaving ] = useState( false );
	const [ isSaved, setIsSaved ] = useState( false );

	useEffect( () => {
		if ( props.saved.some( ( e ) => e.index === props.genindex ) ) {
			setIsSaved( true );
			setIsSaving( false );
		} else {
			setIsSaved( false );
			setIsSaving( false );
		}
	}, [ props.saved ] );

	if ( isSaved ) {
		return (
			<Button
				disabled
				icon={ check }
				label={ __( 'Saved', 'imajinn-ai' ) }
			>
				{ IMAJINN.custom_editor ? __( 'Saved', 'imajinn-ai' ) : '' }
			</Button>
		);
	} else {
		if ( isSaving ) {
			return (
				<Button
					disabled
					style={
						! IMAJINN.custom_editor ? { maxWidth: '36px' } : {}
					}
					icon={ <Spinner /> }
					label={ __( 'Saving', 'imajinn-ai' ) }
				>
					{ IMAJINN.custom_editor
						? __( 'Saving', 'imajinn-ai' )
						: '' }
				</Button>
			);
		} else {
			return (
				<Button
					variant={ IMAJINN.custom_editor ? 'primary' : 'secondary' }
					disabled={ isSaving }
					icon={ upload }
					label={ __( 'Save to Media Library', 'imajinn-ai' ) }
					onClick={ async () => {
						setIsSaving( true );
						if ( ! ( await props.saveImage( props.genindex ) ) ) {
							setIsSaving( false );
						}
					} }
				>
					{ IMAJINN.custom_editor ? __( 'Save', 'imajinn-ai' ) : '' }
				</Button>
			);
		}
	}
};

export default SaveButton;
