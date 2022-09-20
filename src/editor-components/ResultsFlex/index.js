import {
	Card,
	CardMedia,
	Flex,
	FlexBlock,
} from '@wordpress/components';
import {useState, useEffect} from 'react';
import ImageFooter from '../ImageFooter';
const ResultsFlex = ( { saved, generations, queryRatio, ...props } ) => {
    const [ width, setWidth ] = useState( '400px' );
    const [ height, setHeight ] = useState( '400px' );
    useEffect( () => {
        setWidth( generations.length === 1 ? '400px' : '300px' );
        if ( queryRatio === '3:2' ) {
            setHeight( generations.length === 1 ? '266px' : '200px' );
        } else if ( queryRatio === '2:3' ) {
            setHeight( '450px' );
            setWidth( '300px' );
        } else {
            setHeight( generations.length === 1 ? '400px' : '300px' );
        }
    }, [ generations, queryRatio ] ); // <-- here put the parameter to listen

    if ( generations.length === 0 ) {
        return null;
    }


    const ImageResult = ( { ...props } ) => {
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
				<ImageFooter {...props} saved={saved}/>
			</Card>
		);
	};

     

    return (
        <Flex
            { ...props }
            align="center"
            wrap="true"
            gap={ 0 }
            justify="space-around"
            className="results-grid"
        >
            { 
                generations.map( ( image, index ) => (
                    <FlexBlock
                        style={ { minWidth: width, flexGrow: 0 } }
                        key={ index.toString() }
                    >
                        <ImageResult
                            src={ image.preview }
                            genindex={ index }
                            width={ width }
                            height={ height }
                            label={ 'Result ' + ( index + 1 ).toString() }
                        />
                    </FlexBlock>
                ) )
            }
        </Flex>
    );
};

export default ResultsFlex