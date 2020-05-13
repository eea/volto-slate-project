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

import { applyConfig as installVoltoSlate } from 'volto-slate/config';
import installLinkPlugin from 'volto-slate/editor/plugins/Link';

const config = [installVoltoSlate, installLinkPlugin].reduce(
  (acc, apply) => apply(acc),
  voltoConfig,
);

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
