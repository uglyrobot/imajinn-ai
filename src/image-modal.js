import {__} from '@wordpress/i18n';
import {
	Flex, FlexItem, Button, ButtonGroup, TextareaControl, Modal, Card, CardMedia, CardFooter, __experimentalRadio as Radio, __experimentalRadioGroup as RadioGroup,
} from '@wordpress/components';
import {brush, undo, previous} from '@wordpress/icons';
import {useState} from '@wordpress/element';
import CanvasDraw from "@win11react/react-canvas-draw";

export function ImageModal(props) {
	const [isOpen, setOpen] = useState(false);
	const [canvas, setCanvas] = useState(null);
	const [image, setImage] = useState(null);
	const [brushSize, setBrushSize] = useState(20);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

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
				<Radio className="brush-sm" value={10} icon={brush}>{__('Sm', 'imajinn-ai')}</Radio>
				<Radio className="brush-md" value={20} icon={brush}>{__('Md', 'imajinn-ai')}</Radio>
				<Radio className="brush-lg" value={30} icon={brush}>{__('Lg', 'imajinn-ai')}</Radio>
			</RadioGroup>
		</>);
	};

	return (<>
		<Button
			onClick={openModal}
			icon={brush}
			label={__('Edit', 'imajinn-ai')}
		/>
		{isOpen && (<Modal
			{...props}
			onRequestClose={closeModal}
			style={{maxWidth: '800px'}}
			shouldCloseOnClickOutside={false}
			title={__('Modify Image', 'imajinn-ai')}
			icon={brush}
		>
			<Card style={{margin: 'auto', width: 'fit-content'}}>
				<CardMedia>
					<CanvasDraw
						style={{position: 'relative'}}
						ref={canvasDraw => (setCanvas(canvasDraw))}
						imgSrc={props.src}
						brushRadius={brushSize}
						lazyRadius={0}
						brushColor={'black'}
						canvasWidth={512}
						canvasHeight={512}
					/>
				</CardMedia>
				<CardFooter>
					<BrushSize />
					<ButtonGroup>
						<Button
							icon={previous}
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
			<Flex align="bottom" wrap="false">
				<FlexItem>
					<TextareaControl
						maxLength={ 450 }
						value={ props.prompt }
						label={
							<>
								{ __(
									'Use the brush to erase the parts of the image to replace with this text prompt:',
									'imajinn-ai'
								) }
							</>
						}
						className="text-prompt"
						onChange={ ( text ) => props.setPrompt( text ) }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						variant={'primary'}
						onClick={() => {
							setImage(canvas.getDataURL('png', false, '#ffffff'));
						}}
					>
						{__('Generate', 'imajinn-ai')}
					</Button>
				</FlexItem>
			</Flex>


			<img src={image}/>
		</Modal>)}
	</>);
}
