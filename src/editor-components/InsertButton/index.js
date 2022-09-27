import { Button, Spinner } from '@wordpress/components';
import { useState } from 'react';
import { postFeaturedImage } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';

const InsertButton = ( props ) => {
	const [ isSaving, setIsSaving ] = useState( false );

	const insertImageBlock = async ( genIndex ) => {
		let data = false;
		//if already saved load up that data
		if ( saved.some( ( e ) => e.index === genIndex ) ) {
			data = saved.find( ( e ) => e.index === genIndex ).data;
		} else {
			data = await saveImage( genIndex );
		}

		if ( data ) {
			const thisIndex = wp.data
				.select( 'core/block-editor' )
				.getBlocks()
				.map( function ( block ) {
					return block.name == 'infinite-uploads/imajinn-ai';
				} )
				.indexOf( true );

			const newBlock = wp.blocks.createBlock( 'core/image', {
				id: data.attachment_id,
				url: data.url,
				width: data.width,
				height: data.height,
				sizeSlug: data.size,
				alt: props.prompt,
				title: props.prompt,
			} );
			wp.data
				.dispatch( 'core/block-editor' )
				.insertBlocks( newBlock, thisIndex );
			return true;
		}

		return false;
	};

	if ( IMAJINN.custom_editor ) {
		return null;
	}

	if ( isSaving ) {
		return (
			<Button disabled>
				<Spinner />
			</Button>
		);
	} else {
		return (
			<Button
				variant="primary"
				className="imajinn-image-insert"
				disabled={ isSaving }
				icon={ postFeaturedImage }
				onClick={ async () => {
					setIsSaving( true );
					const result = await insertImageBlock( props.genindex );
					if ( ! result ) {
						setIsSaving( false );
					}
				} }
			>
				{ __( 'Insert', 'imajinn-ai' ) }
			</Button>
		);
	}
};

export default InsertButton;
