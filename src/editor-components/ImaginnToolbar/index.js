import { BlockControls } from '@wordpress/block-editor';
import { HelpModal } from '../../help';
import {
	Dashicon,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import {useState, useEffect} from 'react';
import { __, _x } from '@wordpress/i18n';
const ImajinnToolbar = ({isConnected, credits, refreshInfo, visitAccount}) => {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [buttonClass, setButtonClass] = useState('refreshing-button');

	useEffect(() => {
		setButtonClass(
			isRefreshing
				? 'refreshing-button is-refreshing'
				: 'refreshing-button'
		);
	}, [isRefreshing]);

	return (
		<BlockControls>
			<Toolbar
				label={__('Imajinn AI', 'imajinn-ai')}
				className="imajinn-toolbar"
			>
				<ToolbarGroup>
					{isConnected && false !== credits && (
						<>
							<div className="credit-label">
								{__('Credits:', 'imajinn-ai')}
							</div>
							<div className="credits">{credits}</div>
							<ToolbarButton
								className={buttonClass}
								disabled={isRefreshing}
								icon={<Dashicon icon="update"/>}
								label={__(
									'Refresh count',
									'imajinn-ai'
								)}
								onClick={async () => {
									setIsRefreshing(true);
									await refreshInfo();
									setIsRefreshing(false);
								}}
							/>
						</>
					)}
					<ToolbarButton
						onClick={visitAccount}
						icon={<Dashicon icon={"admin-users"}/>}
						label={__('Account / Upgrade', 'imajinn-ai')}
					/>
					<HelpModal/>
				</ToolbarGroup>
			</Toolbar>
		</BlockControls>
	);
};

export default ImajinnToolbar
