import { Notice, __experimentalText as Text } from '@wordpress/components';
import './styles.scss';

const ErrorNotice = ( { hasError } ) => (
	<Notice status="warning">
		<Text>{ hasError }</Text>
	</Notice>
);

export default ErrorNotice;
