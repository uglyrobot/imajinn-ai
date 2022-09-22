import {useState, useEffect} from 'react'
import {
	Button,
	Spinner,
} from '@wordpress/components';
import {
	check,
	upload,
} from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';
const SaveButton = (props) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (props.saved.some((e) => e.index === props.genindex)) {
            setIsSaved(true);
            setIsSaving(false);
        } else {
            setIsSaved(false);
            setIsSaving(false);
        }
    }, [props.saved]);

    if (isSaved) {
        return (
            <Button disabled icon={check}>
                {__('Saved', 'imajinn-ai')}
            </Button>
        );
    } else {
        if (isSaving) {
            return (
                <Button disabled>
                    <Spinner /> {__('Saving', 'imajinn-ai')}
                </Button>
            );
        } else {
            return (
                <Button
                    variant={
                        IMAJINN.custom_editor ? 'primary' : 'secondary'
                    }
                    disabled={isSaving}
                    icon={upload}
                    onClick={async () => {
                        setIsSaving(true);
                        if (!(await props.saveImage(props.genindex))) {
                            setIsSaving(false);
                        }
                    }}
                >
                    {__('Save', 'imajinn-ai')}
                </Button>
            );
        }
    }
};

export default SaveButton