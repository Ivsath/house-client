import { KeyOutlined } from "@ant-design/icons";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { Button, Divider, Modal, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

import { formatListingPrice } from "../../../../lib/utils";

interface Props {
  price: number;
  modalVisible: boolean;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
  price,
  modalVisible,
  checkInDate,
  checkOutDate,
  setModalVisible,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const daysBooked = checkOutDate.diff(checkInDate, "day") + 1;
  const listingPrice = price * daysBooked;

  const handleCreateBooking = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { token: stripeToken, error } = await stripe.createToken(
      cardElement as StripeCardElement,
    );
    console.log(stripeToken);
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}>
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title level={3} className="listing-booking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{" "}
            <Text mark strong>
              {dayjs(checkInDate).format("MMMM D YYYY")}
            </Text>{" "}
            and{" "}
            <Text mark strong>
              {dayjs(checkOutDate).format("MMMM D YYYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            options={{ hidePostalCode: true }}
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            onClick={handleCreateBooking}>
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
