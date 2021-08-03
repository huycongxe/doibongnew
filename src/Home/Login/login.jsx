import React, { useState, useEffect, useRef } from 'react';
import SecureLS from 'secure-ls'
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import appsettings from '../../appsetting.json'

import background from './img/login.svg';
import avatar from './img/avatar.svg';
import wave from './img/wave.png';

import UserServices from '../../services/user.services';


const KEY_ACCESS = "access";
const KEY_PROFILE = "profile";
const KEY_AUTHORIZATION = "authorization";
var ls = new SecureLS({ encodingType: 'aes', isCompression: false, encryptionSecret: appsettings.encryption_secret });
const { Text } = Typography;

const NormalLoginForm = () => {
  const [message, setMessage] = useState(null);


  const onFinish = async values => {
    const resp = await UserServices.login({
      username: values.username,
      password: values.password
    })
    if (resp.data?.data.is_valid) {
      ls.set(KEY_ACCESS, JSON.stringify(resp.data.data["access"]));
      ls.set(KEY_PROFILE, JSON.stringify(resp.data.data["profile"]));
      window.location.replace('/')
    }
    else {
      setMessage(resp.data.data.msg);
    }
  };

  return (
    <div>
      <img class="wave" src={wave} />
      <div className="container">
        <div className="img">
          <img src={background} />
        </div>
        <div className="login-content">

          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <img src={avatar} />
            <h2 className="title">Welcome</h2>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập username!',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} style={{ borderBottom: 'solid 1px black' }} size="large" bordered={false} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Password!',
                },
              ]}
            >
              <Input style={{ borderBottom: 'solid 1px black' }}
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password" size="large" bordered={false}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Text type="danger">{message}</Text>

            </Form.Item>
            <Form.Item>
              <Button type="success" htmlType="submit" shape="round" size="large" className="login-form-button">
                Đăng nhập
        </Button>
            </Form.Item>
          </Form>
        </div>

      </div>
    </div>


    // <div className="login-page">
    // <Form
    //   name="normal_login"
    //   className="login-form"
    //   initialValues={{
    //     remember: true,
    //   }}
    //   onFinish={onFinish}
    // >
    //   <Form.Item
    //     name="username"
    //     rules={[
    //       {
    //         required: true,
    //         message: 'Please input your Username!',
    //       },
    //     ]}
    //   >
    //     <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
    //   </Form.Item>
    //   <Form.Item
    //     name="password"
    //     rules={[
    //       {
    //         required: true,
    //         message: 'Please input your Password!',
    //       },
    //     ]}
    //   >
    //     <Input
    //       prefix={<LockOutlined className="site-form-item-icon" />}
    //       type="password"
    //       placeholder="Password"
    //     />
    //   </Form.Item>
    //   <Form.Item>
    //     <Form.Item name="remember" valuePropName="checked" noStyle>
    //       <Checkbox>Remember me</Checkbox>
    //     </Form.Item>

    //     <a className="login-form-forgot" href="">
    //       Forgot password
    //     </a>
    //   </Form.Item>

    //   <Form.Item>
    //     <Button type="primary" htmlType="submit" className="login-form-button">
    //       Log in
    //     </Button>
    //     Or <a href="">register now!</a>
    //   </Form.Item>
    // </Form>
    // </div>
  );
};

export default NormalLoginForm;
