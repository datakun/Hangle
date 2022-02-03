// import { parseAndCreateWords } from './api/SearchApi';
import { mergeTwoJsArray } from './api/SearchApi';
import App from './App.svelte';

// parseAndCreateWords();
// mergeTwoJsArray();

const app = new App({
	target: document.body,
	props: {},
});

export default app;
