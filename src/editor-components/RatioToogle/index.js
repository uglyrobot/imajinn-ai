import { __, _x } from '@wordpress/i18n';
import {
	__experimentalRadio as Radio,
	__experimentalRadioGroup as RadioGroup,
	__experimentalText as Text,
} from '@wordpress/components';
const RatioToggle = ({ ratio, isLoading, setRatio, image, aspectRatio }) => {
    const ratioNames = {
        '1:1': __( 'Square', 'imajinn-ai' ),
        '3:2': __( 'Wide', 'imajinn-ai' ),
        '2:3': __( 'Tall', 'imajinn-ai' ),
    };
    const label =
        ratioNames[ ratio ] +
        ' images' +
        ( '1:1' !== ratio
            ? ' - ' + __( 'slightly slower to generate', 'imajinn-ai' )
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

export default RatioToggle