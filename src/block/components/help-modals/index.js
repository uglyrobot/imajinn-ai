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
				className="imajinn-prompt-tips"
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
							'Prompt engineering allows you to have better control of what the image will look like. It (if done right) improves the image quality by a lot in every aspect. But if you want to keep it simple, just use our style presets.',
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
							'Running an artificial intelligence neural network requires a lot of computing power. To make this possible, we run a cloud service to run the neural network. This means that you need to connect to our service before you can use the plugin. To connect to Imajinn AI, you need to have a user account. You can create one for free with just your valid email address and a password, or if you already have an account, you can log in with your Imajinn AI email and password.',
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
							'You can control the output ratio of the generated images. Square images are the default, while rectangular images have more pixels and take longer to process.',
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
							"Imajinn AI allows you to save images to your media library, and optionally insert them into your post/page. You can save images by clicking on the save button in the bottom right corner of each image generation. You can insert images into the editor in the same location as the Imajinn block by clicking on the insert button in the bottom right corner. Inserting an image also saves it to your media library, so you don't need to choose both.",
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'When you save or insert an image, it can take a few seconds because we send it to our servers to be upscaled using our advanced AI models so that you get a high resolution optimized image in your media library with no watermarks.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Image Actions', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'For each image result for a generation, you can perform some actions on the image. You can share the image on social media, generate a set of variations, perform a face repair, or enter touchup mode.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							"If you've found an image you like, you can click the Generate Variations button to generate a set of images with similar styles and layout to give you more options to choose from. This will take into account any modifications you've made to the prompt, while still roughly following the original image. Creating variations uses one credit just like a normal generation.",
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							"If you've generated an image of a person and the face looks slightly deformed or unrealistic, you can click the Face Repair button to try and repair any issues with the face. This processes the image on our servers with AI-based facial restoration to restore facial details and enhance colors with a good balance of realness and fidelity. It can't fix every problem with a face, but it can help with some common issues. This tool is most effective for photographic or realistic art; if you try to use it on more abstract artistic faces results may be strange. Face repairs are not stored in your prompt history so that you can easily undo, and do not use any credits.",
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'The Touchup button (or "Inpainting") allows you to customize and make modifications to the image in a more precise way. It allows you to remove or replace parts of the image with new content generated from your prompt. This is useful for removing unwanted objects like watermarks, signatures, and duplicate objects. You can also use it to add new objects to the image, such as a new background or foreground. Using touchup can be a bit tricky, so be sure to read the tips popup inside of the image editor so you can make good use of your credits.',
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Prompt History', 'imajinn-ai' ) }</h3>
					<p>
						{ __(
							'Imajinn saves your prompt history to your site so that you can easily access previous prompts and their results later. Currently the editor will show the last 20 generated prompts and their image results. To jump back in time simply click the Load button next to an item. You can then edit, save, adjust the prompt, styles, or any other action you can normally do after generating a set of images.',
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

export function TouchupHelpModal( { isMobile, ...props } ) {
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	return (
		<>
			<Button
				onClick={ openModal }
				icon={ info }
				label={ isMobile && __( 'Tips', 'imajinn-ai' ) }
			>
				{ ! isMobile && __( 'Tips', 'imajinn-ai' ) }
			</Button>
			{ isOpen && (
				<Modal
					{ ...props }
					onRequestClose={ closeModal }
					style={ { maxWidth: '900px' } }
					icon={ <Icon icon={ info } /> }
					title={ __(
						'Touchup (Inpainting) Instructions',
						'imajinn-ai'
					) }
				>
					<p>
						{ __(
							'The Touchup feature allows you to customize and make modifications to an image in a more precise way. It allows you to remove or replace parts of the image with new content generated from your prompt. This is useful for removing unwanted objects like watermarks, signatures, or duplicates. Or you can also use it to add new objects to the image, such as a new object or background. Touchup allows you to create the exact image you want by choosing where each element in the image goes. You can create the complex image you have in mind, even if it is too specific to get right with one initial prompt.',
							'imajinn-ai'
						) }
					</p>

					<p>
						{ __(
							"Touchup works by choosing an image as an input, masking an area with the brush that you want to modify, then adjusting your prompt to describe what you want in that area. However, this can be quite difficult to work with if you don’t use it right, because sometimes you select an area and put in the prompt, but the image doesn't change. So, here are some tips to help you get the best results from Touchup.",
							'imajinn-ai'
						) }
					</p>

					<h3>{ __( 'Best Practices', 'imajinn-ai' ) }</h3>

					<h4>{ __( 'Prompt Modification', 'imajinn-ai' ) }</h4>
					<p>
						{ __(
							'The most important thing to keep in mind is whether you should describe the entire image you want or only what you want to add. For example, let’s say you want to change an image of an empty shoreline to add a boat floating on the water. You select an area where you want the boat to go, and your prompt in most cases shouldn’t be “a boat”. Instead it should be “Shoreline with a boat floating on the water”. This is because Imajinn needs to know what the context of the entire image should look like, and then it will fill in the area you selected with the boat. If you just say “a boat”, you are more likely to just get an erased area.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'There are some cases when you do want to describe only the thing you want to add instead of the final result. For example, if you are trying to simply erase parts of the image, it may work better to describe "a gray background", or whatever it should be replaced with. Also if you are building an image step-by-step and there are a lot of different subjects, focus your prompt on the section you are painting and generalize the rest of the image as detailed below.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'When modifying the prompt, there is no need to get too poetic or descriptive because most of the image and its styles are already still there and taken into account, unless you paint out a very large portion of the image. Also if our style selectors were used initially, the styles will already be applied to your modified prompt. If you entered your own styles and modifiers to the prompt field, it is best to leave them there so they will be applied to the selected area. Be careful not to change or add styles in the modified prompt that will clash with the rest of the image.',
							'imajinn-ai'
						) }
					</p>

					<h4>
						{ __( 'Step-by-Step Image Building', 'imajinn-ai' ) }
					</h4>
					<p>
						{ __(
							'If you are trying to create a complex image with lots of subjects like people, animals, or objects, it can be impossible to do this with just one long prompt. Instead you can use Touchup to add new elements to the image one-by-one. For example, if you are building a landscape, you can use Touchup to add a new tree, mountain, or different characters one at a time. In this case as you add more objects, you should not describe the entire image in your modified prompt, but instead describe the new object you are adding, and summarize or skip the rest. For example, if you were adding a "girl with a dog", you would not put "girl with a dog, boy dancing, other boy with red shirt sitting" as then Imajinn would loose focus on what you want to put in the masked area. Instead summarize the existing objects like "a bunch of children including a girl with a dog".',
							'imajinn-ai'
						) }
					</p>

					<h4>{ __( 'Other Tips', 'imajinn-ai' ) }</h4>
					<p>
						{ __(
							'When you are making adjustments to part of an existing object, make sure you mask enough of that object so that Imajinn can make a smooth transition between old and new. For example to add a hat to a person, include the top of their head in the masked area. If you want a person next to a cat to be petting the cat, mask their entire arm and part of the cat where their hand would go before prompting “person petting a cat”.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'Be careful with shadows and reflections. Be sure to select not just the object but its shadow and reflection so that the replacement will look more realistic.',
							'imajinn-ai'
						) }
					</p>
					<p>
						{ __(
							'Size matters! Try to select larger areas to replace rather than smaller ones, because the smaller the area is, the less likely it is to actually do anything. Also, the contextual size of the new object to the rest of the image is important too. For example, if you try to replace a cat with an elephant, the size does not make sense to Imajinn, so either nothing will happen or you\'ll only get a piece of the elephant. Either stick with similar sized replacements, or make the prompt ask for a "tiny elephant".',
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
