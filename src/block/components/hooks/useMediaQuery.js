import { useEffect, useState } from '@wordpress/element';

export function useMediaQuery( minWidth ) {
	const [ state, setState ] = useState( {
		windowWidth: window.innerWidth,
		isDesiredWidth: window.innerWidth < minWidth,
	} );

	useEffect( () => {
		const resizeHandler = () => {
			const currentWindowWidth = window.innerWidth;
			const isDesiredWidth = currentWindowWidth < minWidth;
			setState( { windowWidth: currentWindowWidth, isDesiredWidth } );
		};
		window.addEventListener( 'resize', resizeHandler );
		return () => window.removeEventListener( 'resize', resizeHandler );
	}, [ state.windowWidth ] );

	return state.isDesiredWidth;
}

export default useMediaQuery;
