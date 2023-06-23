#!/usr/bin/env node
import React from 'react';
// @ts-expect-error
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ scripts

	Options
		--name  Your name

	Examples
	  $ scripts --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: 'string',
			},
		},
	},
);

render(<App />, {
	patchConsole: true
});
