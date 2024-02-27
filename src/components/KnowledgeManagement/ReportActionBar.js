import { Button, Popconfirm } from 'antd';
import { onDeleteKnowledgeItem, onGetKnowledgeFileUrl } from '../../hooks/knowledge';
import { downloadFile } from '../../utils/file';
import { showErrorToastr } from '../../utils/toastr';
import { useTranslation } from 'react-i18next';
import { isQueued } from '../../utils/status';
import styles from './ReportActionBar.module.scss';

const checkFileCanDownload = rowData => rowData?.s3Key;

const checkFileCanDelete = rowData => !isQueued(rowData?.status);

const ReportActionBar = ({ data, onRefresh, disableDelete }) => {
  const { t } = useTranslation();
  const handleDownload = async ({ id, name }) => {
    const res = await onGetKnowledgeFileUrl(id);
    if (res?.fileUrl) {
      downloadFile(res.fileUrl, name, true);
    } else {
      showErrorToastr('label.toastr.downloading_failure');
    }
  };

  const handleDeleteItem = async id => {
    await onDeleteKnowledgeItem(id);
    onRefresh();
  };

  return (
    <div className={styles.actions}>
      <Button size="small" type="link" onClick={() => handleDownload(data)} disabled={!checkFileCanDownload(data)}>
        {t('operation.download')}
      </Button>
      {!disableDelete && (
        <Popconfirm
          title={t('alert.delete_file', {
            name: data.name,
          })}
          onConfirm={() => handleDeleteItem(data.id)}
          okText={t('operation.delete')}
          cancelText={t('operation.cancel')}
        >
          <Button size="small" type="link" disabled={!checkFileCanDelete(data)}>
            {t('operation.delete')}
          </Button>
        </Popconfirm>
      )}
    </div>
  );
};

export default ReportActionBar;
