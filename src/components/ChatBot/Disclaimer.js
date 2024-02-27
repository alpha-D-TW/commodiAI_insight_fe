import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import styles from './Disclaimer.module.scss';

const Disclaimer = ({ open, onClose }) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      title={null}
      closable={false}
      width={420}
      footer={[
        <Button type="primary" size="large" block onClick={onClose}>
          {t('operation.confirm')}
        </Button>,
      ]}
      style={{ position: 'absolute', right: 32 }}
    >
      <div className={styles.disclaimer}>
        <h3>{t('label.chat.safety_instructions')}</h3>
        <p>
          作为公司，我们对AI所带来的机遇感到兴奋。然而，我们也保持谨慎，并意识到潜在的风险。请遵守以下规定：
          <br />
          您可以将AI用于内部研究或解释复杂话题或头脑风暴等一般任务。
          <br />
          除非您是经过批准的使用案例或试点项目的一部分，否则请勿使用AI服务来开发或审查代码，或创建用于外部材料的图像或其他创意内容。
          <br />
          您可以将GenAI服务与公开可获取的信息或数据一起使用。禁止使用机密客户或内部公司的数据/信息，并且请勿输入会识别我们的客户或合作类型的信息。
          <br />
          您不应使用任何有关公司成员或客户个人信息。
          <br />
          感谢您在保护我们的客户和公司免受不必要风险方面的努力。请阅读我们的AI指南和常见问题解答（FAQ），并确认您致力于遵守公司政策和准则。
        </p>
      </div>
    </Modal>
  );
};

export default Disclaimer;
