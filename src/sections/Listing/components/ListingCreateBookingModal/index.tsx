import { Modal } from "antd";
import React from "react";

interface Props {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBookingModal = ({
  modalVisible,
  setModalVisible,
}: Props) => {
  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}></Modal>
  );
};
