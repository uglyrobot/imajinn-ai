import InsertButton from '../InsertButton';
import SaveButton from '../SaveButton';
import { Button, ButtonGroup, CardFooter } from '@wordpress/components';
import { share } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';
import { InpaintingModal } from '../InpaintingModal';
import FaceFixButton from '../FaceFixButton';
import VariationsButton from '../VariationsButton';
import './styles.scss';

const ImageFooter = ( { ...props } ) => {
	return (
		<CardFooter>
			<ButtonGroup className="imajinn-image-actions">
				<Button
					href={ `${ ajaxurl }?action=imajinn-tweet&image=${ props.src }` }
					target="_blank"
					icon={ share }
					label={ __( 'Share on Twitter', 'imajinn-ai' ) }
				/>
				<VariationsButton { ...props } />
				<FaceFixButton { ...props } />
				<InpaintingModal
					{ ...props }
					src={ props.generations[ props.genindex ].jpg }
				/>
			</ButtonGroup>
			<ButtonGroup>
				<SaveButton { ...props } />
				<InsertButton { ...props } />
			</ButtonGroup>
		</CardFooter>
	);
};

export default ImageFooter;
