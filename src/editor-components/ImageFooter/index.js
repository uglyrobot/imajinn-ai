import InsertButton from "../InsertButton";
import SaveButton from "../SaveButton";
import {
	Button,
	CardFooter
} from '@wordpress/components';
import {share} from '@wordpress/icons';
import {__, _x} from '@wordpress/i18n';
import {InpaintingModal} from "../../inpainting-modal";
import FaceFixButton from "../FaceFixButton";
import VariationsButton from "../VariationsButton";

const ImageFooter = ({genindex, saveImage, saved, ...props}) => {
	return (
		<CardFooter>
			<ButtonGroup className="imajinn-image-actions">
				<Button
					href={`${ajaxurl}?action=imajinn-tweet&image=${props.src}`}
					target="_blank"
					icon={share}
					label={__('Share on Twitter', 'imajinn-ai')}
				/>
				<VariationsButton {...props} />
				<FaceFixButton {...props} />
				<InpaintingModal {...props} src={generations[props.genindex].jpg} {...{prompt, setPrompt, queryRatio, setRatio, startJob}} />
			</ButtonGroup>
			<ButtonGroup>
				<SaveButton {...props} />
				<InsertButton {...props} />
			</ButtonGroup>
		</CardFooter>
	);
};

export default ImageFooter
