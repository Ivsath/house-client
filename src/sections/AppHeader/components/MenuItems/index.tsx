import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import { Viewer } from "../../../../lib/types";

interface Props {
  viewer: Viewer;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer }: Props) => {
  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key={"/user/"}>
          <UserOutlined />
          Profile
        </Item>
        <Item key="logout">
          <LogoutOutlined />
          Log out
        </Item>
      </SubMenu>
    ) : (
      <Item key="/login">
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
