import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Button, Modal, Radio, Upload, Form, message} from 'antd';
import _ from "lodash";

import { ReactComponent as FileIcon } from '../../icons/file-icon.svg';
import {KNOWLEDGE_TYPE, MAX_MB} from '../../constants';
import styles from './modal.module.scss';
import { onUploadKnowledgeFile } from '../../hooks/knowledge';
import { showHintToastr } from '../../utils/toastr';
import { isNotEmptyArray } from '../../utils/formatter';
import { checkFileValid, checkUploadResult, FILE_TYPE } from './utils';

const groupFileBySize = files =>
  _.reduce(
    _.sortBy(files, item => item.size),
    (sum, item, index) => {
      if (!index) {
        return [[item]];
      }
      const lastItem = sum[sum.length - 1];
      const totalSize = _.sumBy(lastItem, f => f?.size || 0) + item.size;
      if (totalSize >= MAX_MB) {
        return _.concat(sum, [[item]]);
      } else {
        sum[sum.length - 1] = _.concat(lastItem, item);
        return sum;
      }
    },
    [],
  );

export const UploadMarketReportModal = ({ visible, onClose, onRefresh, title }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [displayFileList, setDisplayFileList] = useState([]);

  const getCanUploadFiles = () => {
    const availableFileIds = _.map(
      _.filter(displayFileList, item => item.status === 'done'),
      item => item.uid,
    );
    return _.filter(fileList, item => _.includes(availableFileIds, item.uid));
  };

  const handleCloseModal = () => {
    setUploading(false);
    setFileList([]);
    setDisplayFileList([]);
    form.resetFields();
    onClose();
  };

  const handleCheckFile = (file, fileType) => {
    const status = checkFileValid(file, fileType) ? 'done' : 'error';
    setFileList(prevV => [...prevV, file]);
    setDisplayFileList(prevV => [
      ...prevV,
      {
        uid: file.uid,
        name: file.name,
        status,
      },
    ]);
    return false;
  };

  const handleRemoveFile = file => {
    if (file?.uid) {
      setDisplayFileList(prevV => _.filter(prevV, item => item.uid !== file.uid));
    }
  };

  const handleUploadFiles = async (files) =>
    await onUploadKnowledgeFile(files, {type:KNOWLEDGE_TYPE.MARKET_DATA});

  const handleSubmit = async values => {
    setUploading(true);
    const finalFiles = groupFileBySize(getCanUploadFiles());
    const res = await Promise.allSettled(_.map(finalFiles, async files => await handleUploadFiles(files, values)));
    if (checkUploadResult(res)) {
      showHintToastr('label.knowledge.embedding_file');
    }
    handleCloseModal();
    onRefresh();
    message.success('上传成功！')
  };

  const handleUploadClose = () => {
      handleCloseModal();
  };

  return (
    <Modal open={visible} title={title} onCancel={handleUploadClose} footer={null} width={600} centered>
      <div className={styles.form}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            fileType: FILE_TYPE.PDF,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item name="fileType" label={t(`label.knowledge.market_report.fileType`)}>
            <Radio.Group>
              <Radio value={FILE_TYPE.PDF}>PDF</Radio>
              <Radio value={FILE_TYPE.EXCEL}>Excel</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item dependencies={['fileType']} noStyle>
            {({ getFieldValue }) => (
              <Form.Item
                name="files"
                label={t('operation.upload_file')}
                required
                rules={[
                  { required: true, message: '请上传文件！' },
                  () => ({
                    validator() {
                      if (isNotEmptyArray(getCanUploadFiles())) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('warning.knowledge.empty_files')));
                    },
                  }),
                ]}
              >
                <Upload.Dragger
                  multiple
                  fileList={displayFileList}
                  beforeUpload={file => handleCheckFile(file, getFieldValue('fileType'))}
                  onRemove={handleRemoveFile}
                >
                  <p className={styles.uploadIcon}>
                    <FileIcon />
                  </p>
                  <p className={styles.uploadText}>{t('operation.dragging_upload_multiple')}</p>
                  <p className={styles.uploadTips}>
                    {t(`label.knowledge.file.support_${getFieldValue('fileType').toLowerCase()}`)}
                  </p>
                </Upload.Dragger>
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <div className={styles.actionBar}>
              <Button type="primary" htmlType="submit" loading={uploading}>
                {t('operation.submit')}
              </Button>
              <Button onClick={handleUploadClose}>{t('operation.cancel')}</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UploadMarketReportModal;
