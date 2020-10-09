import { Empty, Layout, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Text } = Typography;

export const NotFound = () => {
  return (
    <Content className="not-found">
      <Empty
        description={
          <>
            <Text className="not-found__description-title">
              Uh oh! Something went wrong :(
            </Text>
            <Text className="not-found__description-subtitle">
              The page you're looking for can't be found
            </Text>
          </>
        }
      />
      <Link
        to="/"
        className="not-found__cta ant-btn ant-btn-primary ant-btn-lg">
        Go to Home
      </Link>
    </Content>
  );
};
