import {
	type UnpluginFactory,
	type UnpluginInstance,
	createUnplugin,
} from 'unplugin';
import { readTSConfig } from 'pkg-types';
import { createFilter } from '@rollup/pluginutils';
import ts from 'typescript';
import { type Options, resolveOptions } from './options.js';
import { LanguageServiceHost } from './language_service.js';
import { transformTypia } from './typia.js';

const name = 'unplugin-typia' as const;

/**
 * The main unplugin instance.
 */
const unpluginFactory: UnpluginFactory<
  Options | undefined,
  false
> = (rawOptions = {}) => {
	const options = resolveOptions(rawOptions);
	const filter = createFilter(options.include, options.exclude);

	return {
		name,
		enforce: options.enforce,

		transformInclude(id) {
			return filter(id);
		},

		async transform(_, id) {
			const tsconfig = await readTSConfig();

			if (tsconfig.compilerOptions == null) {
				throw new Error('No compilerOptions found in tsconfig.json');
			}
			const serviceHost = new LanguageServiceHost({
				...tsconfig,
				fileNames: [id],
				options: { ...tsconfig.compilerOptions, moduleResolution: undefined },
				errors: [],
			}, options.cwd);

			const documentRegistry = ts.createDocumentRegistry();
			const service = ts.createLanguageService(serviceHost, documentRegistry);
			serviceHost.setLanguageService(service);

			return transformTypia(
				id,
				service,
				this,
				options,
			);
		},
	};
};

/**
 * This is the unplugin function that is exported.
 *
 * @module
 */
export const unplugin: UnpluginInstance<Options | undefined, false>
/* #__PURE__ */ = createUnplugin(unpluginFactory);

export default unplugin;