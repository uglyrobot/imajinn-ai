const InsertButton = (props) => {
    const [isSaving, setIsSaving] = useState(false);

    if (isSaving) {
        return (
            <Button disabled>
                <Spinner />
            </Button>
        );
    } else {
        return (
            <Button
                variant="primary"
                className="imajinn-image-insert"
                disabled={isSaving}
                icon={postFeaturedImage}
                onClick={async () => {
                    setIsSaving(true);
                    const result = await insertImageBlock(props.genindex);
                    if (!result) {
                        setIsSaving(false);
                    }
                }}
            >
                {__('Insert', 'imajinn-ai')}
            </Button>
        );
    }
};

export default InsertButton