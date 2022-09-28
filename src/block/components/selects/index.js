import { SelectControl, TreeSelect } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
export const StyleSelect = ( {
	setImageStyle,
	isLoading,
	imageStyle,
	optionData,
} ) => {
	return (
		<TreeSelect
			disabled={ isLoading }
			label={ __( 'Select an image style', 'imajinn-ai' ) }
			noOptionLabel="&nbsp;"
			selectedId={ imageStyle }
			onChange={ ( value ) => {
				setImageStyle( value );
			} }
			__next36pxDefaultSize
			tree={ optionData.styles }
		/>
	);
};

export const ArtistSelect = ( {
	setImageArtist,
	isLoading,
	imageArtist,
	optionData,
} ) => {
	return (
		<SelectControl
			__next36pxDefaultSize
			allowReset
			disabled={ isLoading }
			label={ __( 'Select an Artist style', 'imajinn-ai' ) }
			value={ imageArtist }
			onChange={ ( value ) => {
				setImageArtist( value );
			} }
			options={ optionData.artists }
		/>
	);
};

export const ModifierSelect = ( {
	setImageModifier,
	isLoading,
	imageModifier,
	optionData,
} ) => {
	return (
		<SelectControl
			__next36pxDefaultSize
			allowReset
			disabled={ isLoading }
			label={ __( 'Select a style modifier', 'imajinn-ai' ) }
			value={ imageModifier }
			onChange={ ( value ) => {
				setImageModifier( value );
			} }
			options={ optionData.modifiers }
		/>
	);
};
