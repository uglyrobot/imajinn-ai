/**
 * WordPress dependencies
 */
import { createSlotFill, Panel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
	'StandAloneBlockEditorSidebarInspector'
);

function Sidebar() {
	return (
		<div
			className="imajinn-sidebar"
			role="region"
			aria-label={ __( 'Block Editor advanced settings.' ) }
			tabIndex="-1"
		>
			<Panel>
				<InspectorSlot bubblesVirtually />
			</Panel>
		</div>
	);
}

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
