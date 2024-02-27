import _ from "lodash";

export const getEndDateFromData = _.flow([data => _.map(data, item => item.date), _.compact, _.last]);
