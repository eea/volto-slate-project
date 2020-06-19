const defaultBabel = require('@plone/volto/babel');

function applyDefault(api) {
  const voltoBabel = defaultBabel(api);
  if (process.env.CI) {
    voltoBabel.plugins.push('...');
  }
  return voltoBabel;
}

module.exports = applyDefault;
