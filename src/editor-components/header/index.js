/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Imajinn } from '../../images';

export default function Header() {
	return (
		<div
			className="imajinn-header"
			role="region"
			aria-label={ __( 'Imajinn AI', 'imajinn-ai' ) }
			tabIndex="-1"
		>
			<Imajinn />
			<h1 className="imajinn-header__title">
				{ __( 'AI Text-to-Image Generator', 'imajinn-ai' ) }
			</h1>
		</div>
	);
}
