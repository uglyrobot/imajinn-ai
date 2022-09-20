import {__} from '@wordpress/i18n';
import {
	Flex, FlexItem, Button, ButtonGroup, TextareaControl, Modal, Card, CardMedia, CardFooter, __experimentalRadio as Radio, __experimentalRadioGroup as RadioGroup, Icon
} from '@wordpress/components';
import {brush, undo, reusableBlock} from '@wordpress/icons';
import {useState, useEffect} from '@wordpress/element';
import CanvasDraw from "@win11react/react-canvas-draw";

export function InpaintingModal(props) {
	const [isOpen, setOpen] = useState(false);
	const [canvas, setCanvas] = useState(null);
	const [brushSize, setBrushSize] = useState(20);
	const [prompt, setPrompt] = useState(props.prompt);
	const [height, setHeight] = useState(512);
	const [width, setWidth] = useState(512);
	const [origHeight, setOrigHeight] = useState(512);
	const [origWidth, setOrigWidth] = useState(512);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	useEffect(() => {
		if ( props.ratio === '3:2' ) {
			setHeight( 512 );
			setOrigHeight( 512 );
			setWidth( 768 );
			setOrigWidth( 768 );
		} else if ( props.ratio === '2:3' ) {
			setHeight( 512 );
			setOrigHeight( 768 );
			setWidth( 341 );
			setOrigWidth( 512 );
		}
	}, []);

	const focusSelect = ( event ) => event.target.select();

	const BrushSize = () => {

		return (<>
			<RadioGroup
				// id is required for server side rendering
				id="imajinn-brush-size"
				label={__('Select the brush size', 'imajinn-ai')}
				defaultChecked={brushSize}
				onChange={setBrushSize}
				checked={brushSize}
			>
				<Radio label={__('Small', 'imajinn-ai')} className="brush-sm" value={10}><Icon icon={brush} /></Radio>
				<Radio label={__('Medium', 'imajinn-ai')} className="brush-md" value={20}><Icon icon={brush} /></Radio>
				<Radio label={__('large', 'imajinn-ai')} className="brush-lg" value={30}><Icon icon={brush} /></Radio>
			</RadioGroup>
		</>);
	};

	return (
		<>
		<Button
			onClick={openModal}
			icon={brush}
			label={__('Inpainting', 'imajinn-ai')}
		/>
		{isOpen && (<Modal
			{...props}
			onRequestClose={closeModal}
			style={{width: 'min-content', maxHeight: '98%', minWidth: '576px'}}
			shouldCloseOnClickOutside={true}
			title={__('Image Editor', 'imajinn-ai')}
			__experimentalHideHeader={true}
		>
			<Card style={{margin: '0 auto 10px auto', width: 'fit-content'}}>
				<CardMedia>
					<CanvasDraw
						style={{position: 'relative'}}
						ref={canvasDraw => (setCanvas(canvasDraw))}
						imgSrc={props.src}
						brushRadius={brushSize}
						lazyRadius={0}
						hideInterface={true}
						brushColor={'rgba(180,0,0,0.75)'}
						canvasWidth={width}
						canvasHeight={height}
					/>
				</CardMedia>
				<CardFooter>
					<BrushSize />
					<ButtonGroup>
						<Button
							icon={reusableBlock}
							label={__('Reset', 'imajinn-ai')}
							onClick={() => {
								canvas.eraseAll();
							}}
						/>
						<Button
							icon={undo}
							label={__('Undo', 'imajinn-ai')}
							onClick={() => {
								canvas.undo();
							}}
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
							'Change the main subject of the prompt to your replacement and leave any styles in place:',
							'imajinn-ai'
						) }
					</>
				}
				className="text-prompt"
				onFocus={ focusSelect }
				onChange={ ( text ) => setPrompt( text ) }
			/>
			<Flex wrap={false}>
				<FlexItem>
					<Button variant="secondary" onClick={ closeModal }>
						{ __( 'Cancel', 'imajinn-ai' ) }
					</Button>
				</FlexItem>
				<FlexItem>
					<Button
						variant={'primary'}
						onClick={() => {
							//create a temporary canvas to draw the image on for processing
							const img = new Image();
							img.onload = () => {
								const tmpCanvas = document.createElement("canvas");
								tmpCanvas.width = origWidth;
								tmpCanvas.height = origHeight;
								const ctx = tmpCanvas.getContext("2d");
								ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, origWidth, origHeight);

								//convert to black and white
								let imgData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
								let i = 0;
								for (i = 0; i < imgData.data.length; i += 4) {
									let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
									let colour = 0;
									if (count > 383) colour = 255;

									imgData.data[i] = colour;
									imgData.data[i + 1] = colour;
									imgData.data[i + 2] = colour;
									imgData.data[i + 3] = 255;
								}
								ctx.putImageData(imgData, 0, 0);
								const dataURL = tmpCanvas.toDataURL("image/png");
								tmpCanvas.remove();

								props.setRatio( props.queryRatio );
								props.startJob( props.src, dataURL, props.queryRatio, prompt );
								props.setPrompt( prompt );
							}
							img.src = canvas.getDataURL('png', false, '#ffffff'); //export from canvas with white bg and trigger onload to process
						}}
					>
						{__('Generate', 'imajinn-ai')}
					</Button>
				</FlexItem>
			</Flex>
		</Modal>)}
	</>);
}
