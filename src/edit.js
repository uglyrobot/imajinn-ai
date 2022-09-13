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
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';

import { useEffect, useState } from '@wordpress/element';

import {
	__experimentalRadio as Radio,
	__experimentalRadioGroup as RadioGroup,
	__experimentalText as Text,
	Button,
	Card,
	CardFooter,
	CardMedia,
	Dashicon,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
	Modal,
	Notice,
	Placeholder,
	SelectControl,
	Spinner,
	TextareaControl,
	Tooltip,
	TreeSelect,
	Panel,
	PanelBody,
	PanelRow,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';

import {
	aspectRatio,
	check,
	close,
	cloud,
	image,
	postFeaturedImage,
	upload,
} from '@wordpress/icons';
import metadata from './block.json';
import { Imajinn, ImajinnSpinner } from './images';
import { HelpModal, PromptHelpModal } from './help';
import { LicenseModal } from './license';
import { Connect } from './connect';
import optionData from './option-data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

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
	const [ estimatedCredits, setEstimatedCredits ] = useState( 1 );
	const [ credits, setCredits ] = useState( IMAJINN.remaining_credits );
	const [ showUpgrade, setShowUpgrade ] = useState( false );
	const [ imageStyle, setImageStyle ] = useState( '' );
	const [ imageArtist, setImageArtist ] = useState( '' );
	const [ imageModifier, setImageModifier ] = useState( '' );
	const [ saved, setSaved ] = useState( [] );

	//calculate credit estimate
	useEffect( () => {
		let estimate = 1;
		if ( ratio === '1:1' ) {
			estimate = 1;
		} else {
			estimate = 2;
		}

		setEstimatedCredits( estimate );
	}, [ ratio ] ); // <-- here put the parameter to listen

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

	//add our styles to the prompt string
	useEffect( () => {
		setPromptStyle(
			[ prompt, imageStyle, imageArtist, imageModifier ]
				.filter( Boolean )
				.join( ', ' )
		);
	}, [ prompt, imageStyle, imageArtist, imageModifier ] ); // <-- here put the parameter to listen

	const blockProps = useBlockProps();

	//function to make an ajax call to the server to get the image
	const startJob = () => {
		//Check credit status in case we bought more
		if ( credits <= 0 ) {
			refreshInfo();
		}

		//show upgrade modal when trying to start job with no credits
		if ( credits - estimatedCredits <= 0 ) {
			setShowUpgrade( true );
			return false;
		}

		setJobId( null );
		setGenerations( [] );
		setSaved( [] );
		setQueryRatio( ratio );
		setIsLoading( true );
		setError( null );
		setProgress( 0 );

		fetch( `${ ajaxurl }?action=imajinn-start-job`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				prompt: promptStyle,
				ratio: ratio,
				num_variations: 4,
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
						{
							promptStyle,
							ratio,
							generations: result.data.generations,
						},
						...history,
					] );
				} else if ( result.data.status === 'failed' ) {
					setError( result.data.error );
					setStatus( null );
					setIsLoading( false );
					setJobId( null );
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
				}
			} else {
				setStatus( null );
				setIsLoading( false );
				setJobId( null );
				setError( result.data[ 0 ].message );
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

	const insertImageBlock = async ( genIndex ) => {
		let data = false;
		//if already saved load up that data
		if ( saved.some( ( e ) => e.index === genIndex ) ) {
			data = saved.find( ( e ) => e.index === genIndex ).data;
		} else {
			data = await saveImage( genIndex );
		}

		if ( data ) {
			const thisIndex = wp.data
				.select( 'core/block-editor' )
				.getBlocks()
				.map( function ( block ) {
					return block.name == 'imajinn-ai/text2image';
				} )
				.indexOf( true );

			const newBlock = wp.blocks.createBlock( 'core/image', {
				id: data.attachment_id,
				url: data.url,
				width: data.width,
				height: data.height,
				sizeSlug: 'full',
				alt: promptStyle,
				title: promptStyle,
			} );
			wp.data
				.dispatch( 'core/block-editor' )
				.insertBlocks( newBlock, thisIndex );
			return true;
		}

		return false;
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
					prompt: promptStyle,
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

	const ErrorNotice = () => {
		if ( hasError ) {
			return (
				<Notice status="warning">
					<Text>{ hasError }</Text>
				</Notice>
			);
		} else {
			return null;
		}
	};

	const RatioToggle = () => {
		const ratioNames = {
			'1:1': __( 'Square', 'imajinn-ai' ),
			'3:2': __( 'Wide', 'imajinn-ai' ),
			'2:3': __( 'Tall', 'imajinn-ai' ),
		};
		const label =
			ratioNames[ ratio ] +
			' images' +
			( '1:1' !== ratio
				? ' - ' + __( 'uses more credits', 'imajinn-ai' )
				: '' );
		return (
			<>
				<RadioGroup
					// id is required for server side rendering
					id="imajinn-ratio"
					label={ __(
						'Select an image ratio to generate.',
						'imajinn-ai'
					) }
					defaultChecked="1:1"
					disabled={ isLoading }
					onChange={ setRatio }
					checked={ ratio }
				>
					<Radio value="1:1" icon={ image }>
						1:1
					</Radio>
					<Radio value="3:2" icon={ aspectRatio }>
						3:2
					</Radio>
					<Radio
						className="ratio-3-2"
						value="2:3"
						icon={ aspectRatio }
					>
						2:3
					</Radio>
				</RadioGroup>
				<br />
				<Text>{ label }</Text>
			</>
		);
	};

	const CreditEstimate = ( props ) => {
		return (
			<div>
				<p className="credits">{ props.estimatedCredits }</p>
				<Text>{ __( 'Credits', 'imajinn-ai' ) }</Text>
			</div>
		);
	};

	// a spinner to show when the image is loading
	const GeneratingSpinner = () => {
		const label =
			'processing' === status
				? sprintf( __( 'Generating %s%%', 'imajinn-ai' ), progress )
				: __( 'Queued', 'imajinn-ai' );

		if ( isLoading ) {
			return (
				<div className="imajinn-loading">
					<ImajinnSpinner />
					<div>
						<Text>{ label }</Text>
						<Button
							isDestructive
							variant="link"
							onClick={ () => {
								cancelJob();
							} }
						>
							{ __( 'Cancel' ) }
						</Button>
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	const SaveButton = ( props ) => {
		const [ isSaving, setIsSaving ] = useState( false );
		const [ isSaved, setIsSaved ] = useState( false );

		useEffect( () => {
			if ( saved.some( ( e ) => e.index === props.genindex ) ) {
				setIsSaved( true );
				setIsSaving( false );
			} else {
				setIsSaved( false );
				setIsSaving( false );
			}
		}, [ saved ] );

		if ( isSaved ) {
			return (
				<Button disabled icon={ check }>
					{ __( 'Saved', 'imajinn-ai' ) }
				</Button>
			);
		} else {
			if ( isSaving ) {
				return (
					<Button disabled>
						<Spinner /> { __( 'Saving', 'imajinn-ai' ) }
					</Button>
				);
			} else {
				return (
					<Button
						variant="secondary"
						disabled={ isSaving }
						icon={ upload }
						onClick={ async () => {
							setIsSaving( true );
							await saveImage( props.genindex );
						} }
					>
						{ __( 'Save', 'imajinn-ai' ) }
					</Button>
				);
			}
		}
	};

	const InsertButton = ( props ) => {
		const [ isSaving, setIsSaving ] = useState( false );

		if ( isSaving ) {
			return (
				<Button disabled>
					<Spinner />
				</Button>
			);
		} else {
			return (
				<Button
					variant="primary"
					disabled={ isSaving }
					icon={ postFeaturedImage }
					onClick={ async () => {
						setIsSaving( true );
						const result = await insertImageBlock( props.genindex );
						if ( ! result ) {
							setIsSaving( false );
						}
					} }
				>
					{ __( 'Insert', 'imajinn-ai' ) }
				</Button>
			);
		}
	};

	const TopRight = () => {
		return (
			<div className="corner-controls">
				<HelpModal />
				<Button
					icon={ close }
					label={ __( 'Close Imajinn Block', 'imajinn-ai' ) }
					onClick={ () => {
						deleteBlock();
					} }
				/>
			</div>
		);
	};

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
					/>
				</CardMedia>
				<CardFooter>
					<SaveButton { ...props } />
					<Button
						href={ `${ ajaxurl }?action=imajinn-tweet&image=${ props.src }` }
						target="_blank"
						icon={ <Dashicon icon="twitter" /> }
						label="Share on Twitter"
					/>
					<InsertButton { ...props } />
				</CardFooter>
			</Card>
		);
	};

	const ResultsFlex = ( { ...props } ) => {
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

		const images = generations.map( ( image, index ) => (
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
		) );

		return (
			<Flex
				{ ...props }
				align="center"
				wrap="true"
				gap={ 0 }
				justify="space-around"
				className="results-grid"
			>
				{ images }
			</Flex>
		);
	};

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

	const StyleSelect = ( props ) => {
		return (
			<TreeSelect
				disabled={ isLoading }
				label={ __( 'Select an image style', 'imajinn-ai' ) }
				noOptionLabel={ __( 'No Style', 'imajinn-ai' ) }
				selectedId={ imageStyle }
				onChange={ ( value ) => {
					setImageStyle( value );
				} }
				__next36pxDefaultSize
				tree={ optionData.styles }
			/>
		);
	};

	const ArtistSelect = ( props ) => {
		return (
			<SelectControl
				__next36pxDefaultSize
				allowReset
				disabled={ isLoading }
				label={ __( 'Select an Artist style to mimic', 'imajinn-ai' ) }
				value={ imageArtist }
				onChange={ ( value ) => {
					setImageArtist( value );
				} }
				options={ optionData.artists }
			/>
		);
	};

	const ModifierSelect = ( props ) => {
		return (
			<SelectControl
				__next36pxDefaultSize
				allowReset
				disabled={ isLoading }
				label={ __( 'Select a style modifier', 'imajinn-ai' ) }
				value={ imageModifier }
				onChange={ ( value ) => {
					setImageModifier( value );
				} }
				options={ optionData.modifiers }
			/>
		);
	};

	const History = ( props ) => {
		if ( props.history <= 0 ) {
			return null;
		}

		const list = props.history.map( ( item, index ) => (
			<PanelBody key={ index }>
				<h2 className="components-panel__body-title">
					{ item.generations.map( ( gen, index ) => (
						<img
							key={ index }
							src={ gen.thumbnail }
							alt={ 'Result ' + ( index + 1 ).toString() }
						/>
					) ) }
					<Button
						variant="secondary"
						label={ __( 'Load prompt results', 'imajinn-ai' ) }
						onClick={ () => {
							setPrompt( item.promptStyle );
							setGenerations( item.generations );
							setRatio( item.ratio );
							setImageStyle( '' );
							setImageArtist( '' );
							setImageModifier( '' );
						} }
					>
						{ __( 'Load', 'imajinn-ai' ) }
					</Button>
				</h2>
				<PanelRow>
					<Text numberOfLines={ 2 } truncate>
						{ item.promptStyle }
					</Text>
				</PanelRow>
			</PanelBody>
		) );

		return (
			<InspectorControls key="setting">
				<Panel
					header={ __( 'Generation History' ) }
					className="imajinn-history"
				>
					{ list }
				</Panel>
			</InspectorControls>
		);
	};

	const ImajinnToolbar = ( props ) => {
		const [ isRefreshing, setIsRefreshing ] = useState( false );
		const [ buttonClass, setButtonClass ] = useState( 'refreshing-button' );

		useEffect( () => {
			setButtonClass(
				isRefreshing
					? 'refreshing-button is-refreshing'
					: 'refreshing-button'
			);
		}, [ isRefreshing ] );

		return (
			<BlockControls>
				<Toolbar
					label={ __( 'Imajinn AI', 'imajinn-ai' ) }
					className="imajinn-toolbar"
				>
					<ToolbarGroup>
						{ isConnected && false !== credits && (
							<>
								<div className="credit-label">
									{ __( 'Credits:', 'imajinn-ai' ) }
								</div>
								<div className="credits">{ credits }</div>
								<ToolbarButton
									className={ buttonClass }
									disabled={ isRefreshing }
									icon={ <Dashicon icon="update" /> }
									label={ __(
										'Refresh count',
										'imajinn-ai'
									) }
									onClick={ async () => {
										setIsRefreshing( true );
										await refreshInfo();
										setIsRefreshing( false );
									} }
								/>
							</>
						) }
						<HelpModal />
					</ToolbarGroup>
				</Toolbar>
			</BlockControls>
		);
	};

	const GenerateButton = ( props ) => {
		return (
			<Button isPrimary disabled={ isLoading } onClick={ startJob }>
				{ __( 'Generate', 'imajinn-ai' ) }
			</Button>
		);
	};

	const placeholderInstructions = generations.length
		? ''
		: metadata.description;

	return (
		<figure { ...blockProps }>
			<ImajinnToolbar />
			<History history={ history } />
			<Placeholder
				icon={ Imajinn }
				instructions={ placeholderInstructions }
				label={ __(
					'AI Text-to-Image Generator [beta]',
					'imajinn-ai'
				) }
			>
				{ ! isConnected && (
					<Connect
						{ ...{ setCredits, isConnected, setIsConnected } }
					/>
				) }
				{ isConnected && (
					<>
						<ErrorNotice />
						<GeneratingSpinner />
						<ResultsFlex />
						<div className="prompt-form">
							<TextareaControl
								disabled={ isLoading }
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
							/>
							<div className={ 'styles-form' }>
								<StyleSelect />
								<ArtistSelect />
								<ModifierSelect />
								<Button
									icon={ close }
									disabled={ isLoading }
									label={ _x(
										'Clear styles',
										'clear the image style selects',
										'imajinn-ai'
									) }
									onClick={ () => {
										setImageStyle( '' );
										setImageArtist( '' );
										setImageModifier( '' );
									} }
								/>
							</div>
						</div>
						<Flex align="top" wrap="true">
							<FlexItem>
								<RatioToggle />
							</FlexItem>
							<FlexItem>
								<CreditEstimate
									estimatedCredits={ estimatedCredits }
								/>
							</FlexItem>
							<FlexItem>
								<GenerateButton />
								<UpgradeModal
									showUpgrade={ showUpgrade }
									setShowUpgrade={ setShowUpgrade }
								/>
							</FlexItem>
						</Flex>
					</>
				) }
				<TopRight />
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
					<a href="https://infiniteuploads.com/" target={ '_blank' }>
						Infinite Uploads
					</a>
				</span>
			</div>
		</figure>
	);
}
