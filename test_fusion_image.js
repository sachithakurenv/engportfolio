const assert = require('node:assert/strict');
const { projects } = require('./dist/content.json');
const project = projects.find(({ slug }) => slug === 'fusion-wind-turbines');

assert.notEqual(project.detailImage, project.image);
assert.ok(project.gallery.every(({ src }) => src !== project.image));
