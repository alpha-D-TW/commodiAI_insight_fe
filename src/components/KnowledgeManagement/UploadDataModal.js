import { useState } from 'react';
import { Modal } from 'antd';

import { onUploadKnowledgeFile } from '../../hooks/knowledge';
import { showHintToastr } from '../../utils/toastr';
import UploadBox from '../UploadBox';
import UploadingStatusBar from '../UploadBox/UploadingStatusBar';
import {isNotEmptyArray} from "../../utils/formatter";

export const UploadDataModal = ({ visible, onClose, onRefresh, title, uploadType, supportedType }) => {
  const [uploading, setUploading] = useState(false);

  const handleCloseModal = () => {
    setUploading(false);
    onClose();
  };

  const handleUpload = async file => {
    setUploading(true);
    const res = await onUploadKnowledgeFile([file], {
      type: uploadType,
    });
    if (isNotEmptyArray(res) && res[0]?.id) {
      showHintToastr('label.knowledge.embedding_file');
    }
    handleCloseModal();
    onRefresh();
  };

  return (
    <Modal open={visible} title={title} onCancel={handleCloseModal} footer={null} width={600} centered>
      {uploading ? (
        <UploadingStatusBar size="small" />
      ) : (
        <UploadBox size="small" onChange={handleUpload} supportedType={supportedType} />
      )}
    </Modal>
  );
};

export default UploadDataModal;
