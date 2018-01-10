'use strict';

var JSZip = require('jszip');
module.exports = function(buffer) {
	return JSZip.loadAsync(buffer)
	.then(function(zip) {
		var files = zip.file(/.+/);
		var filesData = files.map(function(file) {
			if (file.name.slice(-3).toLowerCase() === 'shp' || file.name.slice(-3).toLowerCase() === 'dbf') {
				return file.async('nodebuffer');
			}
			else {
				return file.async('text');
			}
		});
		return Promise.all(filesData).then(function(content) {
			var out = {};
			files.forEach(function(file, i) {
				out[file.name] = content[i];
			});
			return out;
		});
	});
};
