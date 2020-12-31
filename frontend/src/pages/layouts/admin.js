import { Layout, Menu, Input, Drawer, Result } from 'antd';
import {
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import * as authService from '../../services/authService';
import './admin.css';
import { NavLink, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

let socket;

const Admin = ({ children }) => {
  const history = useHistory();
  socket = io(process.env.REACT_APP_API_BASE_URL);

  const [state, setState] = useState({
    collapsed: false,
  });

  const user = authService.getCurrentUser();

  useEffect(() => {
    socket.on('invitation-accepted', (data) => {
      if (
        user &&
        user.team &&
        user.team === data.team &&
        user._id !== data.from._id
      ) {
        toast.success(`${data.from.name} has just joined ${data.from.team}`);
      }
    });
    socket.on('doc-shared-with', (data) => {
      if (
        user &&
        user.team &&
        user.team === data.author.team &&
        data.editors.includes(user._id)
      ) {
        toast.success(`${data.author.name} has shared a document`);
      }
    });
  }, []);

  const onCollapse = (collapsed) => {
    setState({ collapsed });
  };

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    authService.logout();
    window.location = '/';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ToastContainer />
      <Sider collapsible collapsed={state.collapsed} onCollapse={onCollapse}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: ' 16px 10px 13px',
            color: '#fff',
            fontSize: '12px',
          }}
        >
          <span
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '130px',
            }}
          >
            <UserOutlined /> {user.team}
          </span>
          <span>
            <BellOutlined onClick={showDrawer} style={{ cursor: 'pointer' }} />
            <Drawer
              title="Notifications"
              placement="right"
              closable={false}
              onClose={onClose}
              visible={visible}
            >
              <Result title="No notifications found" />
            </Drawer>
          </span>
        </div>
        <div
          style={{ padding: '8px 8px 16px 5px' }}
          className="search-anything"
        >
          <Input
            style={{
              height: '36px',
              background: '#2d2f34',
              border: '1px solid #2d2f34',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: '400',
              color: '#fff',
            }}
            placeholder="Find anything"
            prefix={<SearchOutlined style={{ marginRight: '7px' }} />}
          />
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item
            key="1"
            icon={<DashboardOutlined />}
            className={
              history.location.pathname === '/dashboard'
                ? 'ant-menu-item-selected'
                : ''
            }
          >
            <NavLink to="/dashboard">Dashboard</NavLink>
          </Menu.Item>
          <SubMenu
            key="sub1"
            icon={<FileOutlined />}
            title="Documents"
            className={
              history.location.pathname.includes('/app/')
                ? 'ant-menu-item-selected'
                : ''
            }
          >
            <Menu.Item
              key="3"
              className={
                history.location.pathname === '/app/new-note'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <NavLink to="/app/new-note">Create New Doc</NavLink>
            </Menu.Item>
            <Menu.Item
              key="4"
              className={
                history.location.pathname === '/app/notes'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <NavLink to="/app/notes">My Private Docs</NavLink>
            </Menu.Item>
            <Menu.Item
              key="5"
              className={
                history.location.pathname === '/app/shared-notes'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <NavLink to="/app/shared-notes">Shared With Me</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            icon={<TeamOutlined />}
            title="Manage Team"
            className={
              history.location.pathname.includes('/settings/organization/')
                ? 'ant-menu-item-selected'
                : ''
            }
          >
            <Menu.Item
              key="6"
              className={
                history.location.pathname === '/settings/organization/profile'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <NavLink to="/settings/organization/profile">
                Personal Settings
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="8"
              className={
                history.location.pathname === '/settings/organization/users'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <NavLink to="/settings/organization/users">Team Members</NavLink>
            </Menu.Item>
            <Menu.Item
              key="9"
              className={
                history.location.pathname ===
                '/settings/organization/invitations'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <NavLink to="/settings/organization/invitations">
                Invitations
              </NavLink>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="12" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
