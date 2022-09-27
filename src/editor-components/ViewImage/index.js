const styles = {
	width: '100%',
	height: '100%',
	position: 'fixed',
	zIndex: 9998,
	top: 0,
	left: 0,
	right: 0,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	background: 'rgba(0,0,0,0.5)',
};

const img = {
	width: '70%',
	height: '70%',
	objectFit: 'contain',
};
const ViewImage = ( { image, setImage } ) => {
	return (
		<div style={ styles } onClick={ () => setImage( null ) }>
			<img src={ image } style={ img } />
		</div>
	);
};

export default ViewImage;
