import {Modal} from '@wordpress/components';

import './styles.scss';

const ViewImage = ({image, setImage}) => {
	return (
		<>
			{image && (
				<Modal
					__experimentalHideHeader={true}
					onRequestClose={() => setImage(null)}
					className="imajinn-preview-modal"
				>
					<img src={image} onClick={() => setImage(null)} />
				</Modal>
			)}
		</>
	);
};

export default ViewImage;
