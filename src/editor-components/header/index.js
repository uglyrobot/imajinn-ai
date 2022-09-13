/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default function Header() {
	return (
		<div
			className="imajinn-header"
			role="region"
			aria-label={ __( 'Imajinn AI', 'imajinn-ai' ) }
			tabIndex="-1"
		>
			<h1 className="imajinn-header__title">
				{ __( 'Imajinn AI', 'imajinn-ai' ) }
			</h1>
		</div>
	);
}
