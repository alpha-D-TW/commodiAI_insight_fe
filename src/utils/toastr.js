import { notification, message } from 'antd';

import Translation from '../components/translation';

export const showSuccessToastr = msg => {
  notification.success({
    message: <Translation text="label.toastr.success" />,
    description: <Translation text={msg} />,
  });
};

export const showErrorToastr = msg => {
  notification.error({
    message: <Translation text="label.toastr.failure" />,
    description: <Translation text={msg} />,
  });
};

export const showHintToastr = msg => {
  notification.info({
    message: <Translation text="label.toastr.hint" />,
    description: <Translation text={msg} />,
  });
};

export const showSuccessMessage = msg => {
  message.success(<Translation text={msg || 'label.toastr.success'} />);
};

export const showErrorMessage = msg => {
  message.error(<Translation text={msg || 'label.toastr.failure'} />);
};

export const showHintMessage = msg => {
  message.info(<Translation text={msg || 'label.toastr.hint'} />);
};
