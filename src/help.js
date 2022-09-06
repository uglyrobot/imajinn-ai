import {__} from '@wordpress/i18n';
import {Button, Icon, Modal} from '@wordpress/components';
import {help, info} from '@wordpress/icons';
import {useState} from '@wordpress/element';

export function PromptHelpModal(props) {
	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	return (
		<>
			<Button
				className="prompt-tips"
				onClick={openModal}
				icon={info}
				label={__('Prompt Tips', 'imajinn-ai')}
			/>
			{isOpen && (
				<Modal
					{...props}
					onRequestClose={closeModal}
					style={{maxWidth: '800px'}}
					icon={<Icon icon={info}/>}
					title={__('Basics of Prompt Engineering', 'imajinn-ai')}
				>
					<p>
						"Prompt Engineering" is an important skill to create
						better generations with this text to image AI. After
						reading this document and applying these simple steps,
						you’ll be able to generate better images with the same
						amount of effort.
					</p>
					<p>
						Note: Your prompt should be in English as the AI model
						was only trained with English labels, and will function
						poorly with other languages. If you speak another
						language you can use a online translation tool, which
						should provide excellent results as it does not have to
						be perfect.
					</p>

					<h3>1. Raw prompt</h3>
					<p>
						Raw prompt is the simplest way of describing what you
						want to generate, for instance;{' '}
					</p>
					<ol>
						<li>Panda</li>
						<li>A warrior with a sword</li>
						<li>Skeleton</li>
					</ol>
					<p>
						This is the basic building block of any prompt. Most new
						people start by only using raw prompts, this is usually
						a mistake as the images you generate like this tend to
						get random and chaotic. It's best to include as much
						detail as possible in your prompt describing exactly
						what you want to see in the scene.
					</p>

					<h3>2. Style</h3>
					<p>
						Style is a crucial part of the prompt. The AI, when
						missing a specified style, usually chooses the one it
						has seen the most in related images, for example, if you
						generated landscape, it would probably generate
						realistic or oil painting looking images. Having a well
						chosen style + raw prompt is sometimes enough, as the
						style influences the image the most right after the raw
						prompt.{' '}
					</p>
					<p>The most commonly used styles include:</p>
					<ol>
						<li>Realistic</li>
						<li>Oil painting</li>
						<li>Pencil drawing</li>
						<li>Concept art</li>
					</ol>
					<p>
						In the case of a realistic image, there are various ways
						of making it the style, most resulting in similar
						images. Here are some commonly used techniques of making
						the image realistic:
					</p>
					<ol>
						<li>a photo of + raw prompt</li>
						<li>a photograph of + raw prompt</li>
						<li>raw prompt, hyperrealistic</li>
						<li>raw prompt, realistic</li>
					</ol>
					<p>
						You can of course combine these to get more and more
						realistic images.
					</p>
					<p>
						To get oil painting you can just simply add “an oil
						painting of” to your prompt. This sometimes results in
						the image showing an oil painting in a frame, to fix
						this you can just re-run the prompt or use raw prompt +
						“oil painting”
					</p>
					<p>
						To make a pencil drawing just simply add “a pencil
						drawing of” to your raw prompt or make your prompt raw
						prompt + “pencil drawing”.
					</p>
					<p>The same applies to landscape art.</p>

					<h3>3. Artist</h3>
					<p>
						To make your style more specific, or the image more
						coherent, you can use artists’ names in your prompt. For
						instance, if you want a very abstract image, you can add
						“made by Pablo Picasso” or just simply, “Picasso”.
					</p>
					<p>
						Below are lists of artists in different styles that you
						can use, but we encourage you to search for different
						artists as it is a cool way of discovering new art.{' '}
					</p>
					<p>Portrait:</p>
					<ol>
						<li>John Singer Sargent</li>
						<li>Edgar Degas</li>
						<li>Paul Cézanne</li>
						<li>Jan van Eyck</li>
					</ol>
					<p>Oil painting:</p>
					<ol>
						<li>Leonardo DaVinci</li>
						<li>Vincent Van Gogh</li>
						<li>Johannes Vermeer</li>
						<li>Rembrandt</li>
					</ol>
					<p>Pencil/Pen drawing:</p>
					<ol>
						<li>Albrecht Dürer</li>
						<li>Leonardo da Vinci</li>
						<li>Michelangelo</li>
						<li>Jean-Auguste-Dominique Ingres</li>
					</ol>
					<p>Landscape art:</p>
					<ol>
						<li>Thomas Moran</li>
						<li>Claude Monet</li>
						<li>Alfred Bierstadt</li>
						<li>Frederic Edwin Church</li>
					</ol>
					<p>
						Mixing the artists is highly encouraged, as it can lead
						to interesting-looking art.
					</p>
					<h3>4. Finishing touches</h3>
					<p>
						This is the part that some people take to extremes,
						leading to longer prompts than this article. Finishing
						touches are the final things that you add to your prompt
						to make it look like you want. For instance, if you want
						to make your image more artistic, add “trending on
						artstation”. If you want to add more realistic lighting
						add “Unreal Engine.” You can add anything you want, but
						here are some examples:
					</p>
					<p>
						Highly detailed, surrealism, trending on art station,
						triadic color scheme, smooth, sharp focus, matte,
						elegant, the most beautiful image ever seen,
						illustration, digital paint, dark, gloomy, octane
						render, 8k, 4k, washed colors, sharp, dramatic lighting,
						beautiful, post processing, picture of the day, ambient
						lighting, epic composition, bokeh, etc.
					</p>
					<h3>5. Conclusion</h3>
					<p>
						Prompt engineering allows you to have better control of
						what the image will look like. It (if done right)
						improves the image quality by a lot in every aspect.
					</p>

					<h3>Some fun example prompts to get you started:</h3>
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
					<Button variant="secondary" onClick={closeModal}>
						{__('Close', 'imajinn-ai')}
					</Button>
				</Modal>
			)}
		</>
	);
}

export function HelpModal(props) {
	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	return (
		<>
			<Button
				onClick={openModal}
				icon={help}
				label={__('Help', 'imajinn-ai')}
			/>
			{isOpen && (
				<Modal
					{...props}
					onRequestClose={closeModal}
					style={{maxWidth: '900px'}}
					icon={<Icon icon={help}/>}
					title={__('Usage Instructions', 'imajinn-ai')}
				>
					<p>
						Imajinn AI is a powerful tool that uses the latest
						technology in AI to generate images from text. It is a
						great tool for writers, artists, and anyone who needs to
						visualize their ideas.
					</p>
					<p>
						The Imajinn AI interface is a block that you can add to
						your post or page. You can add it by clicking on the
						plus button in the top left corner of the editor and
						selecting Imajinn AI. You can also add it by clicking on
						the Imajinn AI icon in the block inserter. It does not
						output any content on your site on its own, but allows
						you to generate and insert images into the same location
						in the block editor. When finished you can just close
						the block.
					</p>

					<h3>Connecting</h3>
					<p>
						Running an artificial intelligence neural network
						requires a lot of computing power. To make this
						possible, we run a cloud service to run the neural
						network. This means that you need to connect to our
						service before you can use the plugin. To connect to
						Imajinn AI, you need to have a user account. You can
						create one for free with just your valid email address
						and a password, or if you already have an account, you
						can log in with your Infinite Uploads/IMAJINN email and
						password.
					</p>

					<h3>Prompts</h3>
					<p>
						To generate images, you need to write a prompt. A prompt
						is a text that describes what you want the image to look
						like. The prompt should be in English as the AI model
						was only trained with English labels, and will function
						poorly with other languages. The prompt can be as short
						as a a few words, or as long as a paragraph. The longer
						the prompt, the more detailed the image will be. Please
						see our prompt engineering guide for more information on
						how to write a good prompt.
					</p>

					<h3>Prefilled Styles</h3>
					<p>
						To give you inspiration and make it easier to generate
						images in specific styles, we have added some dropdowns
						with prefilled styles that you can optionally select
						from. When optionally choosing options here it will
						append specific keywords to your prompt to achieve that
						style when sent to our servers.
					</p>
					<ul>
						<li>
							<strong>Image Style</strong> - Choose from many
							common photographic or artistic styles and mediums.
						</li>
						<li>
							<strong>Artist Style</strong> - Choose to generate
							your images based on the styles of some famous
							artists.
						</li>
						<li>
							<strong>Modifier</strong> - Some fun and common
							styles to give the image output that special
							uniqueness.
						</li>
					</ul>

					<h3>Output Settings</h3>
					<p>
						Imajinn AI allows you to control the output of the
						image(s). You can choose the image count and dimensions.
						Square images use the fewest credits, while rectangular
						images use more credits as they have more pixels and
						take longer to process. Generally it's better to
						generate 4 images at a time as it takes less credits to
						generate them as a batch and you can choose the best
						one.
					</p>

					<h3>Saving Images</h3>
					<p>
						Imajinn AI allows you to save images to your media
						library, and optionally insert them into your post/page.
						You can save images by clicking on the save button in
						the bottom left corner of each image generation. You can
						insert images into the editor in the same location as
						the IMAJINN block by clicking on the insert button in
						the bottom right corner. Inserting an image also saves
						it to your media library, so you don't need to choose
						both.
					</p>

					<h3>Credits</h3>
					<p>
						When you first signup for Imajinn AI, you get a chunk of
						free credits. You can use these credits to generate
						images and get a feel for how the plugin functions and
						learn how to write effective prompts. Credits are based
						on the actual processing time our servers spend. One
						credit is equal to the approximate time it takes to
						generate one square image. If you run out, you can
						purchase more credits from the Imajinn AI website via
						our plans.
					</p>
					<p>
						We display the estimated credits required to generate
						the image(s) based on your chosen settings in the bottom
						right corner of the block. This is generally pretty
						accurate, but can occasionally take slightly more or
						less credits than estimated.
					</p>

					<h3>Filters and Restrictions</h3>
					<p>
						To ensure that the images generated are appropriate for
						all audiences, we have a set of filters and restrictions
						that are applied to prompts and the image outputs. We
						block the use of specific words and phrases in prompts,
						and we scan all generations with an AI moderation filter
						to block images that appear to contain nudity, or other
						inappropriate content.
					</p>
					<p>
						Depending on your prompt construction, it can be a
						fairly common occurrence for it to detect a potentially
						inappropriate image. If this happens, you will see a
						warning message. You can either change your prompt, or
						try generating again. We currently don't charge credits
						for images that are blocked by the filter, but may need
						to change this policy in the future. We monitor prompt
						violations and if we find that you are purposely using
						inappropriate prompts and attempting to bypass our
						restrictions, we may disable your account.
					</p>

					<Button variant="secondary" onClick={closeModal}>
						{__('Close', 'imajinn-ai')}
					</Button>
				</Modal>
			)}
		</>
	);
}
