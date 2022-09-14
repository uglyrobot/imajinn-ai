import { __ } from '@wordpress/i18n';
import { Button, Icon, Modal, ToolbarButton } from '@wordpress/components';
import { help, info } from '@wordpress/icons';
import { useState } from '@wordpress/element';

export function PromptHelpModal( props ) {
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	return (
		<>
			<Button
				className="prompt-tips"
				onClick={ openModal }
				icon={ info }
				label={ __( 'Prompt Tips', 'imajinn-ai' ) }
			/>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ closeModal }
					style={ { maxWidth: '800px' } }
					icon={ <Icon icon={ info } /> }
					title={ __( 'Basics of Prompt Engineering', 'imajinn-ai' ) }
				>
					<p>
						{ __(
							'"Prompt Engineering" is an important skill to create  better generations with this text to image AI. After reading this document and applying these simple steps, you’ll be able to generate better images with the same amount of effort.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'Note: Your prompt should be in English as the AI model was only trained with English labels, and will function poorly with other languages. If you speak another language you can use a online translation tool, which should provide excellent results as it does not have to be perfect.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( '1. Raw prompt', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'Raw prompt is the simplest way of describing what you want to generate, for instance;',
							'imajinn-ai'
						) }
					</p>
					<ol>
						<li>Panda</li>
						<li>A warrior with a sword</li>
						<li>Skeleton</li>
					</ol>
					<p>
						{ __(
							"This is the basic building block of any prompt. Most new people start by only using raw prompts, this is usually a mistake as the images you generate like this tend to get random and chaotic. It's best to include as much detail as possible in your prompt describing exactly what you want to see in the scene.",
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( '2. Style', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'Style is a crucial part of the prompt. The AI, when missing a specified style, usually chooses the one it has seen the most in related images, for example, if you generated landscape, it would probably generate realistic or oil painting looking images. Having a well chosen style + raw prompt is sometimes enough, as the style influences the image the most right after the raw prompt.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'The most commonly used styles include:',
							'imajinn-ai'
						) }
					</p>
					<ol>
						<li>Realistic</li>
						<li>Oil painting</li>
						<li>Pencil drawing</li>
						<li>Concept art</li>
					</ol>
					<p>
						{ __(
							'In the case of a realistic image, there are various ways of making it the style, most resulting in similar images. Here are some commonly used techniques of making the image realistic:',
							'imajinn-ai'
						) }
					</p>
					<ol>
						<li>a photo of + raw prompt</li>
						<li>a photograph of + raw prompt</li>
						<li>raw prompt, hyperrealistic</li>
						<li>raw prompt, realistic</li>
					</ol>
					<p>
						{ __(
							'You can of course combine these to get more and more realistic images.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'To get oil painting you can just simply add “an oil painting of” to your prompt. This sometimes results in the image showing an oil painting in a frame, to fix this you can just re-run the prompt or use raw prompt + “oil painting”',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'To make a pencil drawing just simply add “a pencil drawing of” to your raw prompt or make your prompt raw prompt + “pencil drawing”.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'The same applies to landscape art.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( '3. Artist', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'To make your style more specific, or the image more coherent, you can use artists’ names in your prompt. For instance, if you want a very abstract image, you can add “made by Pablo Picasso” or just simply, “Picasso”.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'Below are lists of artists in different styles that you can use, but we encourage you to search for different artists as it is a cool way of discovering new art.',
							'imajinn-ai'
						) }
					</p>
					<p>{ __( 'Portrait:', 'imajinn-ai' ) }</p>
					<ol>
						<li>John Singer Sargent</li>
						<li>Edgar Degas</li>
						<li>Paul Cézanne</li>
						<li>Jan van Eyck</li>
					</ol>
					<p>{ __( 'Oil painting:', 'imajinn-ai' ) }</p>
					<ol>
						<li>Leonardo DaVinci</li>
						<li>Vincent Van Gogh</li>
						<li>Johannes Vermeer</li>
						<li>Rembrandt</li>
					</ol>
					<p>{ __( 'Pencil/Pen drawing:', 'imajinn-ai' ) }</p>
					<ol>
						<li>Albrecht Dürer</li>
						<li>Leonardo da Vinci</li>
						<li>Michelangelo</li>
						<li>Jean-Auguste-Dominique Ingres</li>
					</ol>
					<p>{ __( 'Landscape art:', 'imajinn-ai' ) }</p>
					<ol>
						<li>Thomas Moran</li>
						<li>Claude Monet</li>
						<li>Alfred Bierstadt</li>
						<li>Frederic Edwin Church</li>
					</ol>
					<p>
						{ __(
							'Mixing the artists is highly encouraged, as it can lead to interesting-looking art.',
							'imajinn-ai'
						) }
					</p>
					<h3>{ __( '4. Finishing touches', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'This is the part that some people take to extremes, leading to longer prompts than this article. Finishing touches are the final things that you add to your prompt to make it look like you want. For instance, if you want to make your image more artistic, add “trending on artstation”. If you want to add more realistic lighting add “Unreal Engine.” You can add anything you want, but here are some examples:',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'Highly detailed, surrealism, trending on art station, triadic color scheme, smooth, sharp focus, matte, elegant, the most beautiful image ever seen, illustration, digital paint, dark, gloomy, octane render, 8k, 4k, washed colors, sharp, dramatic lighting, beautiful, post processing, picture of the day, ambient lighting, epic composition, bokeh, etc.',
							'imajinn-ai'
						) }
					</p>
					<h3>{ __( '5. Conclusion', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'Prompt engineering allows you to have better control of what the image will look like. It (if done right) improves the image quality by a lot in every aspect.',
							'imajinn-ai'
						) }
					</p>

					<h3>
						{ __(
							'Some fun example prompts to get you started:',
							'imajinn-ai'
						) }
					</h3>
					<ul>
						<li>
							A cat walks through a cyberpunk street, rain,
							poster, artstation, neon, futuristic, stunning,
							highly detailed, digital painting
						</li>
						<li>
							a portrait of a family of dwarfs in middle earth, by
							Albert Bierstadt, 8K
						</li>
						<li>
							a <em>[beach|jungle|scene of your choice]</em>,
							highly detailed oil painting, unreal 5 render,
							rhads, Bruce Pennington, Studio Ghibli, tim
							hildebrandt, digital art, octane render, beautiful
							composition, award-winning photograph, masterpiece
						</li>
						<li>
							a close up view of a man looking like Elon Musk.
							rockets launching in the background, highly detailed
							oil painting, render, rhads, Bruce Pennington,
							Studio Ghibli, tim hildebrandt, digital art, octane
							render, beautiful composition, trending on
							artstation, award-winning photograph,
							masterpiece,8k, high quality sharp anime classic
							anime from 2010 in style of Hayao Miyazaki
						</li>
						<li>
							a headless astronaut in space suit, holding space
							helmet in hands, extremely detailed oil painting,
							unreal 5 render, rhads, Bruce Pennington, tim
							hildebrandt, digital art, octane render, beautiful
							composition, trending on artstation, award-winning
							photograph, masterpiece
						</li>
					</ul>
					<Button variant="secondary" onClick={ closeModal }>
						{ __( 'Close', 'imajinn-ai' ) }
					</Button>
				</Modal>
			) }
		</>
	);
}

export function HelpModal( props ) {
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	return (
		<>
			<ToolbarButton
				onClick={ openModal }
				icon={ help }
				label={ __( 'Help', 'imajinn-ai' ) }
			/>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ closeModal }
					style={ { maxWidth: '900px' } }
					icon={ <Icon icon={ help } /> }
					title={ __( 'Usage Instructions', 'imajinn-ai' ) }
				>
					<p>
						{ __(
							'Imajinn AI is a powerful tool that uses the latest technology in AI to generate images from text. It is a great tool for writers, artists, and anyone who needs to visualize their ideas.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'The Imajinn AI interface is a block that you can add to your post or page. You can add it by clicking on the plus button in the top left corner of the editor and selecting Imajinn AI. You can also add it by clicking on the Imajinn AI icon in the block inserter. It does not output any content on your site on its own, but allows you to generate and insert images into the same location in the block editor. When finished you can just close the block.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Connecting', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'Running an artificial intelligence neural network requires a lot of computing power. To make this possible, we run a cloud service to run the neural network. This means that you need to connect to our service before you can use the plugin. To connect to Imajinn AI, you need to have a user account. You can create one for free with just your valid email address and a password, or if you already have an account, you can log in with your Infinite Uploads/Imajinn AI email and password.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Prompts', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'To generate images, you need to write a prompt. A prompt is a text that describes what you want the image to look like. The prompt should be in English as the AI model was only trained with English labels, and will function poorly with other languages. The prompt can be as short as a a few words, or as long as a paragraph. The longer the prompt, the more detailed the image will be. Please see our prompt engineering guide for more information on how to write a good prompt.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Prefilled Styles', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'To give you inspiration and make it easier to generate images in specific styles, we have added some dropdowns with prefilled styles that you can optionally select from. When optionally choosing options here it will append specific keywords to your prompt to achieve that style when sent to our servers.',
							'imajinn-ai'
						) }
					</p>
					<ul>
						<li>
							<strong>
								{ __( 'Image Style', 'imajinn-ai' ) }
							</strong>
							-
							{ __(
								'Choose from many common photographic or artistic styles and mediums.',
								'imajinn-ai'
							) }
						</li>
						<li>
							<strong>
								{ __( 'Artist Style', 'imajinn-ai' ) }
							</strong>
							-
							{ __(
								'Choose to generate your images based on the styles of some famous artists.',
								'imajinn-ai'
							) }
						</li>
						<li>
							<strong>{ __( 'Modifier', 'imajinn-ai' ) }</strong>-
							{ __(
								'Some fun and common styles to give the image output that special uniqueness.',
								'imajinn-ai'
							) }
						</li>
					</ul>

					<h3>{ __( 'Image Ratio', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'You can control the output ratio of the generated images. Square images are the default, while rectangular images have more pixels and take much longer to process.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'The AI model was trained on square images, so depending on the prompt rectangular images may produce strange results such as duplication of the main subject. For example a rectangular image of a person may produce two of the same person, or multiple mouths on the same face. So it may require more prompt editing and generation attempts to get the desired result. Rectangular images are best used for landscapes, scenes, and other objects that do not have a singular main subject.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Saving Images', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							"Imajinn AI allows you to save images to your media library, and optionally insert them into your post/page. You can save images by clicking on the save button in the bottom left corner of each image generation. You can insert images into the editor in the same location as the Imajinn block by clicking on the insert button in the bottom right corner. Inserting an image also saves it to your media library, so you don't need to choose both.",
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Credits', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'When you first signup for Imajinn AI, you get a chunk of free credits. You can use these credits to generate images and get a feel for how the plugin functions and learn how to write effective prompts. If you run out, you can purchase more credits from the Imajinn AI website via our plans.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'Each prompt generation uses one credit, and creates four images that you can choose to save and/or insert into your content. There is no limit to the number of images you can save.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Filters and Restrictions', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'To ensure that the images generated are appropriate for all audiences, we have a set of filters and restrictions that are applied to prompts and the image outputs. We block the use of specific words and phrases in prompts, and we scan all generations with an AI moderation filter to block images that appear to contain nudity, or other inappropriate content.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							"Depending on your prompt construction, it can be a fairly common occurrence for it to detect a potentially inappropriate image. If this happens, you will see a warning message. You can either change your prompt, or try generating again. We currently don't charge credits for images that are blocked by the filter, but may need to change this policy in the future. We monitor prompt violations and if we find that you are purposely using inappropriate prompts and attempting to bypass our restrictions, we may disable your account.",
							'imajinn-ai'
						) }
					</p>

					<Button variant="secondary" onClick={ closeModal }>
						{ __( 'Close', 'imajinn-ai' ) }
					</Button>
				</Modal>
			) }
		</>
	);
}
