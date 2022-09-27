/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __, _x, sprintf } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

import { useEffect, useState } from '@wordpress/element';

import {
	__experimentalText as Text,
	Button,
	Dashicon,
	Flex,
	FlexItem,
	Icon,
	Modal,
	Placeholder,
	TextareaControl,
} from '@wordpress/components';

import { close, cloud } from '@wordpress/icons';
import metadata from './block.json';
import { Imajinn } from './images';
import { PromptHelpModal } from './help';
import { PromptGenieModal } from './prompt-modal';
import { LicenseModal } from './license';
import { Connect } from './connect';
import optionData from './option-data';
import ViewImage from './editor-components/ViewImage';
import History from './editor-components/History';
import RatioToggle from './editor-components/RatioToogle';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './index.scss';
import ImajinnToolbar from './editor-components/ImaginnToolbar';
import {
	ArtistSelect,
	ModifierSelect,
	StyleSelect,
} from './editor-components/selects';
import ErrorNotice from './editor-components/ErrorNotice';
import ResultsFlex from './editor-components/ResultsFlex';
import GeneratingSpinner from './editor-components/GeneratingSpinner';
import TopRight from './editor-components/TopRight';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit() {
	const [ isConnected, setIsConnected ] = useState( IMAJINN.connected );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ hasError, setError ] = useState( null );
	const [ jobId, setJobId ] = useState( null );
	const [ generations, setGenerations ] = useState( [] );
	const [ history, setHistory ] = useState( IMAJINN.history );
	const [ status, setStatus ] = useState( null );
	const [ progress, setProgress ] = useState( 0 );
	const [ prompt, setPrompt ] = useState( '' );
	const [ promptStyle, setPromptStyle ] = useState( '' );
	const [ ratio, setRatio ] = useState( '1:1' );
	const [ queryRatio, setQueryRatio ] = useState( ratio );
	const [ credits, setCredits ] = useState( IMAJINN.remaining_credits );
	const [ showUpgrade, setShowUpgrade ] = useState( false );
	const [ imageStyle, setImageStyle ] = useState( '' );
	const [ imageArtist, setImageArtist ] = useState( '' );
	const [ imageModifier, setImageModifier ] = useState( '' );
	const [ changed, setChanged ] = useState( false );
	const [ saved, setSaved ] = useState( [] );
	const [ faceFixed, setFaceFixed ] = useState( [] );
	const [ selectedImage, setSelectedImage ] = useState( null );

	useEffect( () => {
		return () => {
			setChanged( false );
		};
	}, [ prompt, promptStyle, ratio ] );

	//hide upgrade modal when you have credits
	useEffect( () => {
		IMAJINN.remaining_credits = credits; //update global in case block is inserted again
		if ( credits > 0 ) {
			setShowUpgrade( false );
		}
	}, [ credits ] ); // <-- here put the parameter to listen

	useEffect( () => {
		IMAJINN.history = history; //update global in case block is inserted again
	}, [ history ] );

	//add our styles to the prompt string on changing the dropdowns
	useEffect( () => {
		setPromptStyle(
			[ imageStyle, imageArtist, imageModifier ]
				.filter( Boolean )
				.join( ', ' )
		);
	}, [ imageStyle, imageArtist, imageModifier ] ); // <-- here put the parameter to listen

	const blockProps = useBlockProps();

	//function to make an ajax call to the server to get the image
	const startJob = (
		initImage,
		mask,
		thisQueryRatio,
		customPrompt,
		customStyle
	) => {
		//Check credit status in case we bought more
		if ( credits <= 0 ) {
			refreshInfo();
		}

		//show upgrade modal when trying to start job with no credits
		if ( credits - 1 < 0 ) {
			setShowUpgrade( true );
			return false;
		}

		const thisInitImage = initImage || null;
		const thisMask = mask || null;
		const thisRatio = thisQueryRatio || ratio;
		const thisPrompt = customPrompt ? customPrompt : prompt;
		const thisPromptStyle = customStyle ? customStyle : promptStyle;

		setJobId( null );
		setGenerations( [] );
		setFaceFixed( [] );
		setSaved( [] );
		setQueryRatio( thisRatio );
		setIsLoading( true );
		setError( null );
		setProgress( 0 );

		fetch( `${ ajaxurl }?action=imajinn-start-job`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				prompt: thisPrompt,
				prompt_style: thisPromptStyle,
				ratio: thisRatio,
				num_variations: 4,
				init_image: thisInitImage,
				mask: thisMask,
				nonce: IMAJINN.nonce,
			} ),
		} )
			.then( ( response ) => response.json() )
			.then( ( result ) => {
				if ( result.success ) {
					setJobId( result.data.job_id );
					setStatus( result.data.status );
					setCredits( result.data.remaining_credits );
					setProgress( result.data.progress );
					checkJobLoop( result.data.job_id );
				} else {
					setIsLoading( false );
					setJobId( null );
					setStatus( null );
					setError( result.data[ 0 ].message );
				}
			} )
			.catch( ( error ) => {
				setIsLoading( false );
				setJobId( null );
				setStatus( null );
				setError( error );
			} );
	};

	const checkJobLoop = async ( jobId ) => {
		if ( ! jobId ) {
			setIsLoading( false );
			setJobId( null );
			return false;
		}

		setTimeout( async () => {
			const response = await fetch(
				`${ ajaxurl }?action=imajinn-check-job`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify( {
						job_id: jobId,
						nonce: IMAJINN.nonce,
					} ),
				}
			);
			const result = await response.json();
			if ( result.success ) {
				setStatus( result.data.status );
				setProgress( result.data.progress );
				setCredits( result.data.remaining_credits );
				if ( result.data.status === 'succeeded' ) {
					setGenerations( result.data.generations );
					setHistory( ( history ) => [
						result.data.history,
						...history,
					] );
					setChanged( true );
				} else if ( result.data.status === 'failed' ) {
					setError( result.data.error );
					setStatus( null );
					setIsLoading( false );
					setJobId( null );
					setChanged( true );
				}

				//keep looping until the job is done
				if (
					result.data.status === 'starting' ||
					result.data.status === 'processing'
				) {
					checkJobLoop( jobId );
				} else {
					setStatus( null );
					setIsLoading( false );
					setJobId( null );
					setChanged( true );
				}
			} else {
				setStatus( null );
				setIsLoading( false );
				setJobId( null );
				setError( result.data[ 0 ].message );
				setChanged( true );
			}
		}, 4000 );
	};

	const cancelJob = async () => {
		if ( ! jobId ) {
			setError( 'Error: No job id' );
			return false;
		}

		const response = await fetch(
			`${ ajaxurl }?action=imajinn-cancel-job`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					job_id: jobId,
					nonce: IMAJINN.nonce,
				} ),
			}
		);
		const result = await response.json();
		if ( result.success ) {
			setStatus( null );
			setIsLoading( false );
			setJobId( null );
			setCredits( result.data.remaining_credits );
		} else {
			setError( result.data[ 0 ].message );
		}
	};

	const refreshInfo = async () => {
		const response = await fetch( `${ ajaxurl }?action=imajinn-refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				nonce: IMAJINN.nonce,
			} ),
		} );
		const result = await response.json();
		if ( result.success ) {
			setCredits( result.data.remaining_credits );
		} else {
			setError( result.data[ 0 ].message );
		}
	};

	const visitAccount = async () => {
		const response = await fetch(
			`${ ajaxurl }?action=imajinn-account-url`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					nonce: IMAJINN.nonce,
				} ),
			}
		);
		const result = await response.json();
		if ( result.success ) {
			window.open( result.data.account_url, '_blank' );
		} else {
			setError( result.data[ 0 ].message );
		}
	};

	const saveImage = async ( genIndex ) => {
		let url = generations[ genIndex ].jpg;

		//save the attachment
		const response = await fetch(
			`${ ajaxurl }?action=imajinn-save-image`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					url: url,
					prompt: prompt,
					post_id: wp.data.select( 'core/editor' ).getCurrentPostId(),
					nonce: IMAJINN.nonce,
				} ),
			}
		);
		const result = await response.json();
		if ( result.success ) {
			setSaved( ( saved ) => [
				...saved,
				{ index: genIndex, data: result.data },
			] );
			wp.data.dispatch( 'core/notices' ).createNotice(
				'success', // Can be one of: success, info, warning, error.
				__( 'Image saved to media library.', 'imajinn-ai' ), // Text string to display.
				{
					type: 'snackbar',
					isDismissible: true, // Whether the user can dismiss the notice.
					actions: [],
				}
			);
			return result.data;
		}

		return false;
	};

	const deleteBlock = () => {
		const { removeBlocks } = wp.data.dispatch( 'core/block-editor' );
		const block_ids = wp.data
			.select( 'core/block-editor' )
			.getSelectedBlockClientIds();
		removeBlocks( block_ids );
	};

	const focusSelect = ( event ) => event.target.select();

	const UpgradeModal = ( props ) => {
		const [ isOpen, setOpen ] = useState( props.showUpgrade );
		const closeModal = () => {
			setOpen( false );
			props.setShowUpgrade( false );
		};

		useEffect( () => {
			setOpen( props.showUpgrade );
		}, [ setOpen, props ] ); // <-- here put the parameter to listen

		return (
			<>
				{ isOpen && (
					<Modal
						{ ...props }
						onRequestClose={ closeModal }
						style={ { maxWidth: '400px' } }
						icon={ <Icon icon={ cloud } /> }
						title={ __( 'Upgrade Plan', 'imajinn-ai' ) }
					>
						<p>
							{ __(
								'Sorry, you are out of available image generation credits. You can get more credits by upgrading your account to one of our premium plans.',
								'imajinn-ai'
							) }
						</p>

						<div className="imajinn-upgrade-modal-buttons">
							<Button
								variant="primary"
								href={ IMAJINN.checkout_url }
								target="_blank"
							>
								{ __( 'Get More Credits', 'imajinn-ai' ) }
							</Button>
							<Button variant="secondary" onClick={ closeModal }>
								{ _x(
									'Cancel',
									"Don't upgrade now",
									'imajinn-ai'
								) }
							</Button>
						</div>
					</Modal>
				) }
			</>
		);
	};

	const placeholderInstructions = generations.length
		? ''
		: metadata.description;

	const clearStyles = () => {
		setImageStyle( '' );
		setImageArtist( '' );
		setImageModifier( '' );
		setPromptStyle( '' );
	};

	return (
		<>
			{ selectedImage && (
				<ViewImage
					image={ selectedImage }
					setImage={ setSelectedImage }
				/>
			) }
			<figure { ...blockProps }>
				<ImajinnToolbar
					{ ...{ refreshInfo, isConnected, credits, visitAccount } }
				/>
				{ isConnected && (
					<History
						{ ...{
							history,
							setPrompt,
							setPromptStyle,
							setGenerations,
							setRatio,
							clearStyles,
							setQueryRatio,
							setSaved,
							setFaceFixed,
						} }
					/>
				) }
				<Placeholder
					icon={ IMAJINN.custom_editor ? null : Imajinn }
					instructions={ placeholderInstructions }
					label={
						IMAJINN.custom_editor
							? null
							: __( 'AI Text-to-Image Generator', 'imajinn-ai' )
					}
				>
					{ ! isConnected && (
						<Connect
							{ ...{ setCredits, isConnected, setIsConnected } }
						/>
					) }
					{ isConnected && (
						<>
							{ hasError && (
								<ErrorNotice hasError={ hasError } />
							) }
							{ isLoading && (
								<GeneratingSpinner
									status={ status }
									progress={ progress }
									cancelJob={ cancelJob }
								/>
							) }
							<ResultsFlex
								{ ...{
									prompt,
									setPrompt,
									saved,
									queryRatio,
									setRatio,
									faceFixed,
									setFaceFixed,
									generations,
									setGenerations,
									startJob,
									saveImage,
									setSelectedImage,
								} }
							/>
							<div className="prompt-form">
								<TextareaControl
									disabled={ isLoading }
									rows={ 2 }
									maxLength={ 450 }
									value={ prompt }
									label={
										<>
											{ __(
												'Prompt - Enter a detailed English description of the image you would like to generate.',
												'imajinn-ai'
											) }
											<PromptHelpModal />
										</>
									}
									className="text-prompt"
									onChange={ ( text ) => setPrompt( text ) }
									onFocus={ focusSelect }
								/>
								<Text
									className={ 'prompt-style' }
									numberOfLines={ 2 }
									truncate
								>
									{ promptStyle }
								</Text>
								<div className={ 'styles-form' }>
									<PromptGenieModal
										{ ...{
											prompt,
											setPrompt,
											setPromptStyle,
											startJob,
											setError,
											clearStyles,
											isLoading,
										} }
									/>
									<StyleSelect
										setImageStyle={ setImageStyle }
										isLoading={ isLoading }
										imageStyle={ imageStyle }
										optionData={ optionData }
									/>
									<ArtistSelect
										setImageArtist={ setImageArtist }
										isLoading={ isLoading }
										imageArtist={ imageArtist }
										optionData={ optionData }
									/>
									<ModifierSelect
										setImageModifier={ setImageModifier }
										isLoading={ isLoading }
										imageModifier={ imageModifier }
										optionData={ optionData }
									/>
									<Button
										icon={ close }
										disabled={ isLoading }
										label={ _x(
											'Clear styles',
											'clear the image style selects',
											'imajinn-ai'
										) }
										onClick={ clearStyles }
									/>
								</div>
							</div>
							<Flex align="top" wrap="true">
								<FlexItem>
									<RatioToggle
										{ ...{ ratio, setRatio, isLoading } }
									/>
								</FlexItem>
								<FlexItem>
									<Button
										isPrimary
										disabled={ isLoading }
										onClick={ () => startJob() }
									>
										{ __(
											! changed
												? 'Generate'
												: 'Try Again',
											'imajinn-ai'
										) }
									</Button>
									<UpgradeModal
										showUpgrade={ showUpgrade }
										setShowUpgrade={ setShowUpgrade }
									/>
								</FlexItem>
							</Flex>
						</>
					) }
					{ ! IMAJINN.custom_editor && (
						<TopRight deleteBlock={ deleteBlock } />
					) }
				</Placeholder>

				<div className="imajinn-footer">
					<Button
						onClick={ () => {
							visitAccount();
						} }
					>
						{ __( 'Account', 'imajinn-ai' ) }
					</Button>

					<LicenseModal />

					<a
						href="https://infiniteuploads.com/support/"
						target={ '_blank' }
					>
						{ __( 'Support', 'imajinn-ai' ) }
					</a>

					<span className={ 'imajinn-credits' }>
						{ _x(
							'Made with ',
							'Made with love by Infinite Uploads',
							'imajinn-ai'
						) }
						<Dashicon
							icon="heart"
							aria-label={ _x(
								'love',
								'Made with love by Infinite Uploads',
								'imajinn-ai'
							) }
						/>
						{ _x(
							' by ',
							'Made with love by Infinite Uploads',
							'imajinn-ai'
						) }
						<a
							href="https://infiniteuploads.com/"
							target={ '_blank' }
						>
							Infinite Uploads
						</a>
					</span>
				</div>
			</figure>
		</>
	);
}
