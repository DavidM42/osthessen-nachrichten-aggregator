// svelte.config.js
const sveltePreprocess = require('svelte-preprocess');

// following https://daveceddia.com/svelte-with-sass-in-vscode/
module.exports = {
    preprocess: sveltePreprocess(),
    // ...other svelte options could go here
};
