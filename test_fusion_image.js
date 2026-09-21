const assert = require('node:assert/strict');
const { projects } = require('./dist/content.json');
const project = projects.find(({ slug }) => slug === 'fusion-wind-turbines');

assert.equal(project.image, 'assets/autodesk-fusion-360.jpeg');
assert.ok(project.gallery.every(({ src }) => src !== project.image));
