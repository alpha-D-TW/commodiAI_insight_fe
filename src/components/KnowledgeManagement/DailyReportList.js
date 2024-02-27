import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from "lodash";

import { formatDateToDisplay } from '../../utils/formatter';
import { EMPTY_PLACEHOLDER, KNOWLEDGE_STATUS } from '../../constants';
import ReportActionBar from './ReportActionBar';

const DailyReportList = ({ loading, allFiles, onRefresh, disableDelete }) => {
  const { t } = useTranslation();

  return (
    <>
      <Table
        rowKey="id"
        dataSource={allFiles}
        loading={loading}
        columns={[
          {
            key: 'name',
          },
          {
            key: 'status',
            render: v =>
              _.values(KNOWLEDGE_STATUS).includes(v) ? t(`label.knowledge.status.${v}`) : EMPTY_PLACEHOLDER,
          },
          {
            key: 'created',
            render: formatDateToDisplay,
          },
          {
            key: 'action',
            render: (v, rowData) => (
              <ReportActionBar data={rowData} onRefresh={onRefresh} disableDelete={disableDelete} />
            ),
          },
        ].map(item => ({
          ...item,
          dataIndex: item.key,
          title: t(`label.knowledge.market_report.${item.key}`),
        }))}
      />
    </>
  );
};

export default DailyReportList;
