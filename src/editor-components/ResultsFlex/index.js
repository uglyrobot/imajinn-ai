import { Card, CardMedia } from '@wordpress/components';
import ImageFooter from '../ImageFooter';
import searchIcon from './search.svg';
const ResultsFlex = ( { setSelectedImage, queryRatio, ...props } ) => {
	const width = '300px';
	const height = '300px';

	const ImageResult = ( { ...props } ) => {
		return (
			<Card>
				<CardMedia
					className="loop-show"
					style={ {
						width: props.width,
						height: props.height,
						position: 'relative',
						cursor: 'pointer',
					} }
				>
					<div
						className="loop-icon"
						onClick={ () => setSelectedImage( props.src ) }
					>
						<div>
							<img src={ searchIcon } />
						</div>
					</div>
					<img
						className="generation-zoom"
						alt={ props.alt || props.label }
						src={ props.src }
						width={ props.width }
						height={ props.height }
					/>
				</CardMedia>
				<ImageFooter { ...props } />
			</Card>
		);
	};

	return (
		<div
			className="results-grid"
			style={ {
				gridTemplateColumns: ! IMAJINN.custom_editor && '1fr 1fr',
			} }
		>
			{ props.generations &&
				props.generations.map( ( image, index ) => (
					<div
						style={ { minWidth: width, flexGrow: 1 } }
						key={ index }
					>
						<ImageResult
							src={ image.preview }
							genindex={ index }
							width={ width }
							height={ height }
							label={ 'Result ' + ( index + 1 ).toString() }
							{ ...props }
						/>
					</div>
				) ) }
		</div>
	);
};

export default ResultsFlex;
