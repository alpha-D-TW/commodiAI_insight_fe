import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from "lodash";

import { formatDateToDisplay } from '../../utils/formatter';
import { EMPTY_PLACEHOLDER, KNOWLEDGE_STATUS } from '../../constants';
import ReportActionBar from './ReportActionBar';

const MarketReportList = ({ allFiles, onRefresh, loading }) => {
  const {
    t,
  } = useTranslation();

  return (
      <div style={{padding:'0 24px'}}>
    <Table
        bordered
        pagination={false}
      rowKey="id"
      dataSource={allFiles}
      loading={loading}
      columns={[
        {
          key: 'name',
        },
        {
          key: 'created',
          render: formatDateToDisplay,
        },
        {
          key: 'action',
          render: (v, rowData) => <ReportActionBar data={rowData} onRefresh={onRefresh} />,
        },
      ].map(({ key, render }) => ({
        key,
        dataIndex: key,
        title: t(`label.knowledge.market_report.${key}`),
        render,
      }))}
    />
      </div>

  );
};

export default MarketReportList;
