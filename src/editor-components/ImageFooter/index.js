import InsertButton from "../InsertButton";
import SaveButton from "../SaveButton";
import {
	Button,
	CardFooter,
	Dashicon,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
const ImageFooter = ({ genindex,saveImage, saved,...props }) => {
    if (IMAJINN.custom_editor) {
        return (
            <CardFooter>
                <Button
                    href={`${ajaxurl}?action=imajinn-tweet&image=${props.src}`}
                    target="_blank"
                    icon={<Dashicon icon="twitter" />}
                    label={__('Share on Twitter', 'imajinn-ai')}
                />
                <SaveButton {...props} saved={saved} saveImage={saveImage}/>
            </CardFooter>
        );
    } else {
        return (
            <CardFooter>
                <SaveButton {...props} saved={saved} saveImage={saveImage}/>
                <Button
                    href={`${ajaxurl}?action=imajinn-tweet&image=${props.src}`}
                    target="_blank"
                    icon={<Dashicon icon="twitter" />}
                    label={__('Share on Twitter', 'imajinn-ai')}
                />
                <InsertButton {...props} genindex={genindex}/>
            </CardFooter>
        );
    }
};

export default ImageFooter