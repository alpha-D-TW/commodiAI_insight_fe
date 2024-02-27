import qs from 'qs';
import _ from "lodash";

export const stringifySearchToQuery = params =>
	_.isEmpty(params) ? '' : qs.stringify(params, { addQueryPrefix: true, arrayFormat: 'repeat' });

export const parseSearchFromQuery = search => {
	const v = qs.parse(decodeURIComponent(search), { ignoreQueryPrefix: true });
	return _.isEmpty(v) ? {} : v;
};

export const decodeHash = hash => (hash ? decodeURIComponent(hash).substring(1) : '');
