import React, {useEffect, useState} from 'react';
import {Button, Radio} from 'antd';
import {useTranslation} from 'react-i18next';
import _ from "lodash";

import {onGetKnowledgeBatchData} from '../../hooks/knowledge';
import {CHAT_CHART_TYPE, DATE_PERIOD, mapChartTypes, mapDataToChart} from './chartUtils';
import LoadingBar from '../ChatMessage/LoadingBar';
import {ReactComponent as ChartIcon} from '../../icons/icon-chart.svg';
import ChatYearsChart from './ChatYearsChart';
import ChatTrendChart from './ChatTrendChart';
import styles from './index.module.scss';
import {isNotEmptyArray} from "../../utils/formatter";
import {LANGUAGES} from "../../constants";
import ChatBarChart from "./ChatBarChart";

const SLICE_LENGTH = {
    ALL: 0,
    ONE_MONTH: 30,
    THREE_MONTHS: 90,
    SIX_MONTHS: 180,
    ONE_YEAR: 365
}

const ChatChartAnswer = ({isLastOne, answer, answerId, model}) => {
    const {t, i18n: {language}} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [chartsData, setChartsData] = useState(null);
    const [showChart, setShowChart] = useState(isLastOne);
    const allChartTypes = _.uniq(_.flatten(_.map(answer, item => mapChartTypes(item?.chartTypes))));
    const [currentChartType, setCurrentChartType] = useState(allChartTypes[0] || CHAT_CHART_TYPE.TREND);
    const [period, setPeriod] = useState(SLICE_LENGTH.ONE_MONTH)

    useEffect(() => {
        if (isLastOne) {
            handleFetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLastOne]);

    const handleFetchData = async () => {
        setLoading(true);
        const res = await onGetKnowledgeBatchData(answerId, model, language === LANGUAGES.EN);
        setChartsData(res);
        setLoading(false);
    };

    const renderChart = (item, index) => {
        if (item.period === DATE_PERIOD.YEARLY && currentChartType === CHAT_CHART_TYPE.YEARS) {
            return <ChatBarChart key={index} data={item}/>
        }
        if (
            [CHAT_CHART_TYPE.YEARS, CHAT_CHART_TYPE.SEASONS, CHAT_CHART_TYPE.WEEK_AVERAGE].includes(currentChartType) &&
            item.chartTypes.includes(currentChartType)
        ) {
            return <ChatYearsChart key={index} data={item} chartType={currentChartType}/>;
        }
        return <ChatTrendChart key={index} data={item}/>;
    };

    const renderSummary = summary => (summary ? <p>{summary}</p> : null);

    if (loading) {
        return <LoadingBar/>;
    }
    if (!showChart) {
        return (
            <div className={styles.chartBtn}>
                <span>{t('label.chat.is_chart_answer')}</span>
                <Button
                    onClick={() => {
                        setShowChart(true);
                        handleFetchData();
                    }}
                >
                    <ChartIcon/>
                    {t('operation.click_to_show')}
                </Button>
            </div>
        );
    }
    const allData = _.map(answer, (ansItem, index) => {
        const {period, chartTypes, dataRangeYears, unit: sheetUnit} = ansItem || {};
        const chartData = chartsData && chartsData[index] ? chartsData[index] : null;
        const {data: currentData, dateColumn, columns, summary, analysis} = chartData || {};
        const {years: allYears, data} = mapDataToChart(currentData, dateColumn, columns, period);
        return {
            allYears,
            columns,
            data,
            dateColumn,
            period,
            chartTypes: mapChartTypes(chartTypes),
            summary,
            analysis,
            dataRangeYears,
            sheetUnit,
        };
    });
    const simpleData = (props) => {
        const formatDate = (dateString) => {
            const [month, day] = dateString.split("-");
            return `${props.year}/${props.month}/${day}`;
        };

        return _.compact([
            formatDate(props['指标日期']),
            props['开盘价'],
            props['收盘价'],
            props['最高价'],
            props['最低价']
        ])
    };

    const allChartsCount = _.sum(_.map(allData, ({columns}) => (isNotEmptyArray(columns) ? columns.length : 0)));
    console.log(117,allData)
    const hasPlaceholder = allChartsCount > 1 && allChartsCount % 2 === 1;
    return (
        <>
            {_.map(allData, ({summary, analysis, chartTypes}, index) =>
                summary || analysis ? (
                    <div key={index} className={styles.summary}>
                        {renderSummary(summary)}
                        {renderSummary(analysis)}
                    </div>
                ) : null,
            )}
            {/*<>*/}
            {/*    <div style={{display: 'flex', marginBottom: '16px', justifyContent: 'flex-end', paddingRight: '24px'}}>*/}
            {/*        <Radio.Group defaultValue={SLICE_LENGTH.ONE_MONTH} buttonStyle="solid"*/}
            {/*                     onChange={e => setPeriod(e.target.value)}>*/}
            {/*            <Radio.Button value={SLICE_LENGTH.ALL}>全部</Radio.Button>*/}
            {/*            <Radio.Button value={SLICE_LENGTH.ONE_MONTH}>1个月</Radio.Button>*/}
            {/*            <Radio.Button value={SLICE_LENGTH.THREE_MONTHS}>3个月</Radio.Button>*/}
            {/*            <Radio.Button value={SLICE_LENGTH.SIX_MONTHS}>6个月</Radio.Button>*/}
            {/*            <Radio.Button value={SLICE_LENGTH.ONE_YEAR}>1年</Radio.Button>*/}
            {/*        </Radio.Group>*/}
            {/*    </div>*/}
            {/*    <MyChartComponent rawData={allData[0].data.map(i => simpleData(i))} period={period}/>*/}
            {/*</>*/}
            {isNotEmptyArray(allChartTypes) && allChartTypes.length > 1 && (
                <div className={styles.radios}>
                    <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        size="small"
                        options={allChartTypes.map(item => ({
                            value: item,
                            label: t(`label.chat.chart_type.${item}`),
                        }))}
                        value={currentChartType}
                        onChange={({target: {value}}) => setCurrentChartType(value)}
                    />
                </div>
            )}
            <div className={styles.charts}>
                {_.map(allData, renderChart)}
                {hasPlaceholder && <div className={styles.chart}/>}
            </div>
        </>
    );
};

export default ChatChartAnswer;
