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
          key: 'status',
          render: v => (_.values(KNOWLEDGE_STATUS).includes(v) ? t(`label.knowledge.status.${v}`) : EMPTY_PLACEHOLDER),
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
  );
};

export default MarketReportList;
