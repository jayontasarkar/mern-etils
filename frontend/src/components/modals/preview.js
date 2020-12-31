import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { Markup } from 'interweave';

const PreviewModal = ({ title, content }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" shape="round" onClick={showModal} ghost>
        <i className="fa fa-search-plus" aria-hidden="true"></i>&nbsp;Preview
      </Button>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width="767px"
      >
        <Markup content={content} />
      </Modal>
    </>
  );
};

export default PreviewModal;
