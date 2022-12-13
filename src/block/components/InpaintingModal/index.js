import { __ } from '@wordpress/i18n';
import {
	Flex,
	FlexItem,
	Button,
	ButtonGroup,
	TextareaControl,
	Modal,
	Card,
	CardMedia,
	CardFooter,
	__experimentalRadio as Radio,
	__experimentalRadioGroup as RadioGroup,
	Icon,
} from '@wordpress/components';
import { brush, undo, reusableBlock } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
import CanvasDraw from '@win11react/react-canvas-draw';
import useMediaQuery from '../hooks/useMediaQuery';
import { TouchupHelpModal } from '../help-modals';
import './styles.scss';

export function InpaintingModal( props ) {
	const isMobile = useMediaQuery( 600 );
	const [ responsiveMultiplier, setResponsiveMultiplier ] = useState(
		isMobile ? 0.6 : 1
	);

	const [ isOpen, setOpen ] = useState( false );
	const [ canvas, setCanvas ] = useState( null );
	const [ tempCanvas, setTempCanvas ] = useState( null );
	const [ brushSize, setBrushSize ] = useState( 25 );
	const [ prompt, setPrompt ] = useState( props.prompt );
	const [ height, setHeight ] = useState( 512 * responsiveMultiplier );
	const [ width, setWidth ] = useState( 512 * responsiveMultiplier );
	const [ origHeight, setOrigHeight ] = useState( 512 );
	const [ origWidth, setOrigWidth ] = useState( 512 );
	const [ canvasData, setCanvasData ] = useState( null );

	useEffect( () => {
		setResponsiveMultiplier( isMobile ? 0.6 : 1 );
	}, [ isMobile ] );

	useEffect( () => {
		setCanvasData( canvas?.getSaveData() ); //save drawing

		if ( props.queryRatio === '3:2' ) {
			setHeight( 341 * responsiveMultiplier );
			setWidth( 512 * responsiveMultiplier );
			setOrigHeight( 512 );
			setOrigWidth( 768 );
		} else if ( props.queryRatio === '2:3' ) {
			if ( ! isMobile ) {
				setHeight( 512 * responsiveMultiplier );
				setWidth( 341 * responsiveMultiplier );
			} else {
				setHeight( 768 * responsiveMultiplier );
				setWidth( 512 * responsiveMultiplier );
			}
			setOrigHeight( 768 );
			setOrigWidth( 512 );
		} else {
			setHeight( 512 * responsiveMultiplier );
			setWidth( 512 * responsiveMultiplier );
		}

		setBrushSize( ( brushSize ) => brushSize * responsiveMultiplier );

		canvas?.clear();
	}, [ responsiveMultiplier ] );

	//when width changes, redraw the canvas with saved data
	useEffect( () => {
		canvas?.loadSaveData(
			canvasData,
			true
		);
	}, [ width ] );

	const focusSelect = ( event ) => event.target.select();

	const BrushSize = () => {
		return (
			<>
				<RadioGroup
					// id is required for server side rendering
					id="imajinn-brush-size"
					label={ __( 'Select the brush size', 'imajinn-ai' ) }
					defaultChecked={ brushSize }
					onChange={ setBrushSize }
					checked={ brushSize }
				>
					<Radio
						label={ __( 'Small', 'imajinn-ai' ) }
						className="brush-sm"
						value={ 10 * responsiveMultiplier }
					>
						<Icon icon={ brush } />
					</Radio>
					<Radio
						label={ __( 'Medium', 'imajinn-ai' ) }
						className="brush-md"
						value={ 25 * responsiveMultiplier }
					>
						<Icon icon={ brush } />
					</Radio>
					<Radio
						label={ __( 'large', 'imajinn-ai' ) }
						className="brush-lg"
						value={ 40 * responsiveMultiplier }
					>
						<Icon icon={ brush } />
					</Radio>
				</RadioGroup>
			</>
		);
	};

	return (
		<>
			<Button
				onClick={ () => setOpen( true ) }
				icon={ brush }
				label={ __( 'Touchup (beta)', 'imajinn-ai' ) }
			/>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ () => setOpen( false ) }
					className={ 'imajinn-inpainting-modal' }
					shouldCloseOnClickOutside={ true }
					title={ __( 'Touchup Image Editor (beta)', 'imajinn-ai' ) }
				>
					<Card>
						<CardMedia>
							<CanvasDraw
								style={ { position: 'relative' } }
								ref={ ( canvasDraw ) =>
									setCanvas( canvasDraw )
								}
								imgSrc={ props.src }
								brushRadius={ brushSize }
								lazyRadius={ 0 }
								hideInterface={ true }
								brushColor={ 'rgba(180,0,0,0.75)' }
								canvasWidth={ width }
								canvasHeight={ height }
							/>
						</CardMedia>
						<CardFooter>
							<BrushSize />
							<TouchupHelpModal { ...{ isMobile } } />
							<ButtonGroup>
								<Button
									icon={ reusableBlock }
									label={ __( 'Reset', 'imajinn-ai' ) }
									onClick={ () => {
										canvas.eraseAll();
									} }
								/>
								<Button
									icon={ undo }
									label={ __( 'Undo', 'imajinn-ai' ) }
									onClick={ () => {
										canvas.undo();
									} }
								/>
							</ButtonGroup>
						</CardFooter>
					</Card>
					<TextareaControl
						rows={ 3 }
						maxLength={ 450 }
						value={ prompt }
						label={
							<>
								{ __(
									'Modified prompt describing the entire image and the masked area:',
									'imajinn-ai'
								) }
							</>
						}
						className="text-prompt"
						onFocus={ focusSelect }
						onChange={ ( text ) => setPrompt( text ) }
					/>
					<Flex wrap={ false }>
						<FlexItem>
							<Button
								variant="secondary"
								onClick={ () => setOpen( false ) }
							>
								{ __( 'Cancel', 'imajinn-ai' ) }
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								variant={ 'primary' }
								onClick={ () => {
									//create a temporary canvas to draw the image on for processing
									const img = new Image();
									img.onload = () => {
										const tmpCanvas =
											document.createElement( 'canvas' );
										tmpCanvas.width = origWidth;
										tmpCanvas.height = origHeight;
										const ctx =
											tmpCanvas.getContext( '2d' );
										ctx.drawImage(
											img,
											0,
											0,
											img.width,
											img.height,
											0,
											0,
											origWidth,
											origHeight
										);

										//convert to black and white
										let imgData = ctx.getImageData(
											0,
											0,
											tmpCanvas.width,
											tmpCanvas.height
										);
										let i = 0;
										for (
											i = 0;
											i < imgData.data.length;
											i += 4
										) {
											let count =
												imgData.data[ i ] +
												imgData.data[ i + 1 ] +
												imgData.data[ i + 2 ];
											let colour = 255;
											if ( count > 383 ) colour = 0;

											imgData.data[ i ] = colour;
											imgData.data[ i + 1 ] = colour;
											imgData.data[ i + 2 ] = colour;
											imgData.data[ i + 3 ] = 255;
										}
										ctx.putImageData( imgData, 0, 0 );
										const dataURL =
											tmpCanvas.toDataURL( 'image/png' );
										tmpCanvas.remove();

										props.setRatio( props.queryRatio );
										props.startJob(
											props.src,
											dataURL,
											props.queryRatio,
											prompt
										);
										props.setPrompt( prompt );
									};
									tempCanvas.clear();
									tempCanvas.loadSaveData(
										canvas.getSaveData(),
										true
									); //redraw at correct size
									img.src = tempCanvas.getDataURL(
										'png',
										false,
										'#ffffff'
									); //export from canvas with white bg and trigger onload to process
								} }
							>
								{ __( 'Generate', 'imajinn-ai' ) }
							</Button>
						</FlexItem>
					</Flex>
					<CanvasDraw
						style={ {
							visibility: 'hidden',
							position: 'absolute',
							top: '-99999px',
							left: '-99999px',
						} }
						disabled={ true }
						hideGrid={ true }
						ref={ ( canvasTemp ) => setTempCanvas( canvasTemp ) }
						canvasWidth={ origWidth }
						canvasHeight={ origHeight }
					/>
				</Modal>
			) }
		</>
	);
}

export default InpaintingModal;
