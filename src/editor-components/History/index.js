import {
    __experimentalText as Text,
    Button,
    Panel,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';
const History = ({
    history,
    setPrompt,
    setGenerations,
    setRatio,
    setImageStyle,
    setImageArtist,
    setImageModifier
}) => {

    return (
        <InspectorControls key="setting">
            <Panel
                header={__('Generation History')}
                className="imajinn-history"
            >
                {
                    history.map((item, index) => (
                        <PanelBody key={index}>
                            <h2 className="components-panel__body-title">
                                {item.generations.map((gen, index) => (
                                    <img
                                        key={index}
                                        src={gen.thumbnail}
                                        alt={'Result ' + (index + 1).toString()}
                                    />
                                ))}
                                <Button
                                    variant="secondary"
                                    label={__('Load prompt results', 'imajinn-ai')}
                                    onClick={() => {
                                        setPrompt(item.promptStyle);
                                        setGenerations(item.generations);
                                        setRatio(item.ratio);
                                        setImageStyle('');
                                        setImageArtist('');
                                        setImageModifier('');
                                    }}
                                >
                                    {__('Load', 'imajinn-ai')}
                                </Button>
                            </h2>
                            <PanelRow>
                                <Text numberOfLines={2} truncate>
                                    {item.promptStyle}
                                </Text>
                            </PanelRow>
                        </PanelBody>
                    )
                    )
                }
            </Panel>
        </InspectorControls>
    );
};

export default History