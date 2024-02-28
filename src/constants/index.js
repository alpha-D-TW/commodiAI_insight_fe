export const LANGUAGES = {
	EN: "en",
	CN: 'cn'
}

export const MB = 1024 * 1024;
export const MAX_MB = 30 * MB;
export const XLS = '.xls';
export const XLSX = '.xlsx';
export const XLSM = '.xlsm';
export const DOC = '.doc';
export const DOCX = '.docx';
export const PPT = '.ppt';
export const PPTX = '.pptx';
export const PDF = '.pdf';
export const TXT = '.txt';
export const CSV = '.csv';

export const FILE_TYPES = ['xls', 'xlsx', 'xlsm', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'txt', 'csv', 'bin'];

export const SUPPORT_TYPE = {
	MODEL: 'model',
	RECIPE: 'recipe',
	SUPPORT: 'support',
	PREDICTION: 'prediction',
	KNOWLEDGE_DAILY_DATA: 'knowledge_daily_data',
	KNOWLEDGE_DOMAIN_DATA: 'knowledge_domain_data',
};

export const KNOWLEDGE_STATUS = {
	AV_SCAN_QUEUED: 'av_scan_queued',
	AV_SCAN_SUCCEED: 'av_scan_succeed',
	AV_SCAN_FAILED: 'av_scan_failed',
	OS_LOAD_QUEUED: 'os_load_queued',
	OS_LOAD_SUCCEED: 'os_load_succeed',
	OS_LOAD_FAILED: 'os_load_failed',
	CSV_LOAD_QUEUED: 'csv_load_queued',
	CSV_LOAD_SUCCEED: 'csv_load_succeed',
	CSV_LOAD_FAILED: 'csv_load_failed',
};

export const KNOWLEDGE_CLASSIFICATION = {
	PUBLIC: 'public',
	SENSITIVE: 'sensitive',
};

export const KNOWLEDGE_SOURCE = {
	INTERNAL: 'internal',
	EXTERNAL: 'external',
};

export const GEN_AI_MODEL_TYPE = {
	WENXIN: 'wenxin',
	QWEN: 'qwen',
	GPT35TURBO: "gpt-3.5-turbo"
};

export const KNOWLEDGE_TYPE = {
	MARKET_DATA: 'market_data',
	DAILY_REPORT_DATA: 'daily_report_data',
	WEEKLY_REPORT_DATA: 'weekly_report_data',
	DAILY_REPORT: 'daily_report',
	WEEKLY_REPORT: 'weekly_report',
	DOMAIN_KNOWLEDGE: 'domain_knowledge',
};

export const CHAT_ANSWER_TYPE = {
	JSON: 'json',
	STRING: 'string',
};

export const OPTIMIZE_TYPE = {
	CUSTOMIZED: 'BY_CUSTOMIZATION',
	BY_ANALYSIS: 'BY_ANALYSIS',
	BY_INPUT_DATA: 'BY_INPUT_DATA',
};

export const VARIATION_TYPE = {
	UPPER: 'UPPER',
	LOWER: 'LOWER',
	FLAT: 'FLAT',
};

export const RECIPE_ASPECT = {
	DAILY: 'daily',
	OTHER: 'other',
	MOBILE: 'mobile',
};

export const RECIPE_ASPECTS = [RECIPE_ASPECT.DAILY, RECIPE_ASPECT.OTHER];

export const OPTIMIZATION_PREVIEW_TYPE = {
	RECIPE: 'recipe',
	BASELINE: 'baseline',
};

export const EMPTY_PLACEHOLDER = '-';
