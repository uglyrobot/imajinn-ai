import {Modal} from '@wordpress/components';

import './styles.scss';

const ViewImage = ({image, setImage, generations}) => {
	return (
		<>
			{image !== null && (
				<Modal
					__experimentalHideHeader={true}
					onRequestClose={() => setImage(null)}
					className="imajinn-preview-modal"
					onKeyDown={(event) => {
						//allow browsing via arrow keys
						const last = generations.length - 1;
						if (event.key === 'ArrowRight') {
							if (image < last) {
								setImage(image + 1);
							} else {
								setImage(0);
							}
						} else if (event.key === 'ArrowLeft') {
							if (image > 0) {
								setImage(image - 1);
							} else {
								setImage(last);
							}
						}
					}}
				>
					<img src={generations[image].preview} onClick={() => setImage(null)} />
				</Modal>
			)}
		</>
	);
};

export default ViewImage;
