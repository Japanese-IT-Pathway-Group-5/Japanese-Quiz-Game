export function scrollIntoViewOnKeyboard(node: HTMLElement) {
	const scrollIntoView = () => {
		node.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	};

	const handleFocus = () => {
		// Wait for the mobile keyboard to finish opening before scrolling.
		window.setTimeout(scrollIntoView, 300);
	};

	node.addEventListener('focus', handleFocus);

	return {
		destroy() {
			node.removeEventListener('focus', handleFocus);
		}
	};
}
