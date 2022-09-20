import InsertButton from "../InsertButton";
import SaveButton from "../SaveButton";
import {
	Button,
	CardFooter,
	Dashicon,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
const ImageFooter = ({ saved,...props }) => {
    if (IMAJINN.custom_editor) {
        return (
            <CardFooter>
                <Button
                    href={`${ajaxurl}?action=imajinn-tweet&image=${props.src}`}
                    target="_blank"
                    icon={<Dashicon icon="twitter" />}
                    label={__('Share on Twitter', 'imajinn-ai')}
                />
                <SaveButton {...props} saved={saved}/>
            </CardFooter>
        );
    } else {
        return (
            <CardFooter>
                <SaveButton {...props} />
                <Button
                    href={`${ajaxurl}?action=imajinn-tweet&image=${props.src}`}
                    target="_blank"
                    icon={<Dashicon icon="twitter" />}
                    label={__('Share on Twitter', 'imajinn-ai')}
                />
                <InsertButton {...props} />
            </CardFooter>
        );
    }
};

export default ImageFooter