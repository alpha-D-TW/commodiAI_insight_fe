export const isFailed = status => status && status.toLowerCase().endsWith('_failed');

export const isSucceeded = status =>
	status && (status.toLowerCase().endsWith('_succeed') || status.toLowerCase().endsWith('_success'));

export const isQueued = status => status && status.toLowerCase().endsWith('_queued');
