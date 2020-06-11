/**
 * Add your config changes here.
 * @module config
 * @example
 * export const settings = {
 *   ...defaultSettings,
 *   port: 4300,
 *   listBlockTypes: {
 *     ...defaultSettings.listBlockTypes,
 *     'my-list-item',
 *   }
 * }
 */

import * as voltoConfig from '@plone/volto/config';
// import applyAddonsConfiguration from '@plone/volto/helpers/Addons/applyAddonsConfiguration';

import { applyConfig as installVoltoSlate } from 'volto-slate/config';

const config = [installVoltoSlate].reduce((acc, apply) => apply(acc), {
  ...voltoConfig,
});

// const config = applyAddonsConfiguration(voltoConfig);

export const settings = {
  ...config.settings,
};

export const views = {
  ...config.views,
};

export const widgets = {
  ...config.widgets,
};

export const blocks = {
  ...config.blocks,
};

export const addonReducers = { ...config.addonReducers };
export const addonRoutes = [];
