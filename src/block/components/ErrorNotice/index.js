import { Notice, __experimentalText as Text } from '@wordpress/components';
const ErrorNotice = ( { hasError } ) => (
	<Notice status="warning">
		<Text>{ hasError }</Text>
	</Notice>
);

export default ErrorNotice;
