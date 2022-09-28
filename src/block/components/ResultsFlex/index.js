import { useState, useEffect } from '@wordpress/element';
import { Card, CardMedia } from '@wordpress/components';
import ImageFooter from '../ImageFooter';
import searchIcon from './search.svg';

const ResultsFlex = ( { setSelectedImage, ...props } ) => {
	const [ width, setWidth ] = useState( '300px' );
	const [ height, setHeight ] = useState( '300px' );

	useEffect( () => {
		if ( props.queryRatio === '3:2' ) {
			setHeight( '200px' );
			setWidth( '300px' );
		} else if ( props.queryRatio === '2:3' ) {
			setHeight( '450px' );
			setWidth( '300px' );
		} else {
			setHeight( '300px' );
			setWidth( '300px' );
		}
	}, [ props.generations, props.queryRatio ] );

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
						onClick={ () => setSelectedImage( props.genindex ) }
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
