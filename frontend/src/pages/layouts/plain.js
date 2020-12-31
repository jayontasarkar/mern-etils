import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu, Layout } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as authService from '../../services/authService';

const { Header, Footer, Content } = Layout;

const centerStyle = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
};

const Plain = ({ children }) => {
  const user = authService.getCurrentUser();

  const retriveUsernameFromEmail = (email) => {
    return email.substring(0, email.lastIndexOf('@'));
  };

  const handleLogout = () => {
    authService.logout();
    window.location = '/';
  };

  return (
    <Layout className="layout">
      <ToastContainer />
      <Header style={centerStyle}>
        <Link to="/" className="plain-logo">
          etils
        </Link>
        <Menu theme="dark" mode="horizontal">
          {user ? (
            <Menu.SubMenu
              key="SubMenu"
              icon={<UserOutlined />}
              title={retriveUsernameFromEmail(user.email)}
            >
              <Menu.Item key="setting:1">
                <Link to="/dashboard">
                  <DashboardOutlined /> Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key="setting:2" onClick={handleLogout}>
                <LogoutOutlined />
                Logout
              </Menu.Item>
            </Menu.SubMenu>
          ) : (
            <>
              <Menu.Item key="2">
                <Link to="/auth/signin">Sign in</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/auth/signup">Sign up</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      <Content
        style={{
          padding: '0 50px',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Content>
      <Footer className="plain-footer">
        ETILS @2020 developed by jayontasarkar
      </Footer>
    </Layout>
  );
};

export default Plain;
