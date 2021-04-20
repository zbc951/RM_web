require('intl');
require('intl/locale-data/jsonp/en.js');
if (process.env.ENV === 'production') {
	// Production
} else {
	// Development
	Error['stackTraceLimit'] = Infinity;
	require('zone.js/dist/long-stack-trace-zone');
}