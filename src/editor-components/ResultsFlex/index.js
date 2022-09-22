import { Card, CardMedia } from '@wordpress/components';
import ImageFooter from '../ImageFooter';
const ResultsFlex = ( { saveImage, setSelectedImage, saved, generations, queryRatio, ...props } ) => {
    const width = '300px'
    const height = '300px'

    const ImageResult = ( { genindex,...props } ) => {
		return (
			<Card>
				<CardMedia
					style={ { width: props.width, height: props.height } }
				>
					<img
						className="generation-zoom"
						alt={ props.alt || props.label }
						{ ...props }
						onClick={()=>setSelectedImage(props.src)}
					/>
				</CardMedia>
				<ImageFooter genindex={genindex} {...props} saved={saved} saveImage={saveImage}/>
			</Card>
		);
	};

    return (
        <div className="results-grid" style={{gridTemplateColumns:!IMAJINN.custom_editor&&'1fr 1fr'}}>
            { 
                generations&&generations.map( ( image, index ) => (
                    <div
                        style={ { minWidth: width, flexGrow: 1 } }
                        key={index}
                    >
                        <ImageResult
                            src={ image.preview }
                            genindex={ index }
                            width={ width }
                            height={ height }
                            label={ 'Result ' + ( index + 1 ).toString() }
                        />
                    </div>
                ) )
            }
        </div>
    );
};

export default ResultsFlex