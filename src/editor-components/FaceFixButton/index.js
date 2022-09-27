import { Button, Spinner } from '@wordpress/components';
import { useState, useEffect } from 'react';
import { commentAuthorAvatar } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';

const FaceFixButton = ( {
	generations,
	setGenerations,
	faceFixed,
	setFaceFixed,
	...props
} ) => {
	const [ isFixing, setIsFixing ] = useState( false );
	const [ isFixed, setIsFixed ] = useState( false );

	const faceFix = async ( genIndex ) => {
		let image = generations[ genIndex ].jpg;

		//save the attachment
		const response = await fetch(
			`${ ajaxurl }?action=imajinn-face-repair`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					image: image,
					nonce: IMAJINN.nonce,
				} ),
			}
		);
		const result = await response.json();
		if ( result.success ) {
			setFaceFixed( ( faceFixed ) => [
				...faceFixed,
				{ index: genIndex },
			] );
			//insert the new image array into the generations
			setGenerations( ( generations ) => {
				generations[ genIndex ] = result.data.image;
				return [ ...generations ];
			} );
			wp.data.dispatch( 'core/notices' ).createNotice(
				'success', // Can be one of: success, info, warning, error.
				__( 'Face repair completed.', 'imajinn-ai' ), // Text string to display.
				{
					type: 'snackbar',
					isDismissible: true, // Whether the user can dismiss the notice.
					actions: [],
				}
			);
			return result.data;
		}

		return false;
	};

	useEffect( () => {
		if ( faceFixed.some( ( e ) => e.index === props.genindex ) ) {
			setIsFixed( true );
			setIsFixing( false );
		} else {
			setIsFixed( false );
			setIsFixing( false );
		}
	}, [ faceFixed ] );

	if ( isFixing ) {
		return (
			<Button
				disabled
				icon={ <Spinner /> }
				label={ __( 'Repairing', 'imajinn-ai' ) }
			/>
		);
	} else {
		return (
			<Button
				disabled={ isFixed }
				icon={ commentAuthorAvatar }
				label={ __( 'Face Repair', 'imajinn-ai' ) }
				onClick={ async () => {
					setIsFixing( true );
					if ( ! ( await faceFix( props.genindex ) ) ) {
						setIsFixing( false );
					}
				} }
			/>
		);
	}
};

export default FaceFixButton;
