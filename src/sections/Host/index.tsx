import {
  BankOutlined,
  HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload,
} from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ListingType } from "../../lib/graphql/globalTypes";
import { Viewer } from "../../lib/types";
import { displayErrorMessage, iconColor } from "../../lib/utils";

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item, useForm } = Form;

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void,
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    // Should probably check for null or ArrayBuffer
    callback(reader.result as string);
  };
};

const beforeImageUpload = (file: File) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 1MB in size!",
    );
  }
  return isJpgOrPng && isLt2M;
};

// https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
// eslint-disable-next-line
const dummyRequest = ({ _file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

export const Host = ({ viewer }: Props) => {
  const [form] = useForm();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    // originFileObj === the file itself passed by the upload component
    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  return (
    <Content className="host-content">
      <Form layout="vertical" form={form}>
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Item
          label="Home Type"
          name="type"
          rules={[{ required: true, message: "Please select a home type!" }]}>
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor }} />{" "}
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor }} /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          label="Max # of Guests"
          name="numOfGuests"
          rules={[
            {
              required: true,
              message: "Please enter the max number of guests!",
            },
          ]}>
          <InputNumber min={1} placeholder="4" />
        </Item>

        <Item
          label="Title"
          extra="Max character count of 45"
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter a title for your listing!",
            },
          ]}>
          <Input
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Item>

        <Item
          label="Description of listing"
          extra="Max character count of 400"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter a description for your listing!",
            },
          ]}>
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder={`Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles.`}
          />
        </Item>

        <Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter an address for your listing!",
            },
          ]}>
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item
          label="City/Town"
          name="city"
          rules={[
            {
              required: true,
              message: "Please enter a city (or region) for your listing!",
            },
          ]}>
          <Input placeholder="Los Angeles" />
        </Item>

        <Item
          label="State/Province"
          name="state"
          rules={[
            {
              required: true,
              message: "Please enter a state for your listing!",
            },
          ]}>
          <Input placeholder="California" />
        </Item>

        <Item
          label="Zip/Postal Code"
          name="postalCode"
          rules={[
            {
              required: true,
              message: "Please enter a zip code for your listing!",
            },
          ]}>
          <Input placeholder="Please enter a zip code for your listing!" />
        </Item>

        <Item
          label="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
          name="image"
          rules={[
            {
              required: true,
              message: "Please enter/provide an image for your listing!",
            },
          ]}>
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              customRequest={dummyRequest}
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}>
              {imageBase64Value ? (
                <img src={imageBase64Value} alt="Listing" />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label="Price"
          extra="All prices in $USD/day"
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter a price for your listing!",
            },
          ]}>
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item>
          <Button type="primary">Submit</Button>
        </Item>
      </Form>
    </Content>
  );
};
