import {
	__experimentalText as Text,
	Button,
	Panel,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';

const History = ( {
	history,
	setPrompt,
	setPromptStyle,
	setGenerations,
	setRatio,
	clearStyles,
	setQueryRatio,
	setSaved,
	setFaceFixed,
} ) => {
	if ( history.length <= 0 ) {
		return null;
	}

	return (
		<InspectorControls key="setting">
			<Panel
				header={ __( 'Generation History' ) }
				className="imajinn-history"
			>
				{ history.map( ( item, index ) => (
					<PanelBody key={ index }>
						<h2 className="components-panel__body-title">
							{ item.generations.map( ( gen, index ) => (
								<img
									key={ index }
									src={ gen.thumbnail }
									alt={ sprintf(
										__( 'Result %d', 'imajinn-ai' ),
										( index + 1 ).toString()
									) }
								/>
							) ) }
							<Button
								variant="secondary"
								label={ __(
									'Load prompt results',
									'imajinn-ai'
								) }
								onClick={ () => {
									clearStyles();
									setPrompt( item.prompt );
									setPromptStyle( item.prompt_style );
									setGenerations( item.generations );
									setRatio( item.ratio );
									setQueryRatio( item.ratio );
									setSaved( [] );
									setFaceFixed( [] );
								} }
							>
								{ __( 'Load', 'imajinn-ai' ) }
							</Button>
						</h2>
						<PanelRow>
							<Text numberOfLines={ 2 } truncate>
								{ item.prompt }
							</Text>
						</PanelRow>
					</PanelBody>
				) ) }
			</Panel>
		</InspectorControls>
	);
};

export default History;
