import React, { createContext, useEffect, useState } from 'react';
import { auth } from './comp/firebase';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Home from './comp/Home';
import Products from './comp/Products'; // Updated to Products component
import History from './comp/History';
import Mall from './comp/Mall';
import { GoogleAuthProvider, onAuthStateChanged, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';
import { Button, Card, Grid, Icon, Image, Menu, Modal, Sidebar, Segment } from 'semantic-ui-react';

export const MyContext = createContext(null);

export default function App() {
  let urlParams = new URLSearchParams(window.location.search);
  let paramsObject = {};
  for (let pair of urlParams.entries()) {
    paramsObject[pair[0]] = pair[1];
  }
  if (Object.keys(paramsObject).length === 0) {
    paramsObject = { page: 'Home' };
  }
  const [params, setParams] = useState(paramsObject);
  const [user, setUser] = useState(null);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    const unsubscribeIdToken = onIdTokenChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribeAuthState();
      unsubscribeIdToken();
    };
  }, []);

  function doLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  function doLogout() {
    signOut(auth)
      .then(() => {
        setUser(null);
        setLogoutConfirmationOpen(false);
        setSidebarVisible(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const toggleDarkTheme = () => {
    setDarkTheme(prevDarkTheme => !prevDarkTheme);
  };

  return (
    <div style={{ marginTop: '20px', marginLeft: '20px' }}>
      <MyContext.Provider value={{ user, setUser, params, setParams }}>
        {user ? (
          <Sidebar.Pushable as='div'>
            <Sidebar
              as={Menu}
              animation='overlay'
              onHide={() => setSidebarVisible(false)}
              vertical
              visible={sidebarVisible}
              width='thin'
              style={{ backgroundColor: '#f5f5f5' }}
            >
              <Menu.Item onClick={() => setUserModalOpen(true)}>
                <Image src={user.photoURL} avatar />
                <br />
                <br />
                {user.displayName}
              </Menu.Item>
              <Menu.Item onClick={() => { setParams({ page: 'Home' }); setSidebarVisible(false); }}>
                <Icon name='home' />
                Home
              </Menu.Item>
              <Menu.Item onClick={() => { setParams({ page: 'Products' }); setSidebarVisible(false); }}>
                <Icon name='cart' />
                Products
              </Menu.Item>
              <Menu.Item onClick={() => { setParams({ page: 'History' }); setSidebarVisible(false); }}>
                <Icon name='user' />
                My Accounts
              </Menu.Item>
              <Menu.Item onClick={() => { setParams({ page: 'Mall' }); setSidebarVisible(false); }}>
                <Icon name='shopping bag' />
                Mall
              </Menu.Item>
              <Menu.Item onClick={() => { setLogoutConfirmationOpen(true); setSidebarVisible(false); }}>
                <Icon name='sign-out' />
                Logout
              </Menu.Item>
              <Menu.Item onClick={toggleDarkTheme}>
                <Icon name={darkTheme ? 'sun' : 'moon'} />
                {darkTheme ? 'Light Theme' : 'Dark Theme'}
              </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Button icon onClick={() => setSidebarVisible(true)}>
                  <Icon name='bars' />
                </Button>
                <Button className='logout' color='red' onClick={() => setLogoutConfirmationOpen(true)}>
                  <Icon name='sign-out' />
                  Logout
                </Button>
              </div>

              <Segment>
                <Menu secondary fluid style={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}>
                  <Menu.Item style={{ flex: 1, padding: '0', margin: '0' }}>
                    <Button color='purple' onClick={() => setParams({ page: 'Home' })} style={{ flex: 1, margin: '0', padding: '10px' }}>
                      <Icon name='home' /> Home
                    </Button>
                  </Menu.Item>
                  <Menu.Item style={{ flex: 1, padding: '0', margin: '0' }}>
                    <Button color='yellow' onClick={() => setParams({ page: 'Products' })} style={{ flex: 1, margin: '0', padding: '10px' }}>
                      <Icon name='opencart' />Product
                    </Button>
                  </Menu.Item>
                  <Menu.Item style={{ flex: 1, padding: '0', margin: '0' }}>
                    <Button color='green' onClick={() => setParams({ page: 'History' })} style={{ flex: 1, margin: '0', padding: '10px' }}>
                      <Icon name='user' /> Profile
                    </Button>
                  </Menu.Item>
                  <Menu.Item style={{ flex: 1, padding: '0', margin: '0' }}>
                    <Button color='blue' onClick={() => setParams({ page: 'Mall' })} style={{ flex: 1, margin: '0', padding: '10px' }}>
                      <Icon name='shopping bag' /> Mall
                    </Button>
                  </Menu.Item>
                </Menu>

                <div className={darkTheme ? "dark" : "light"}>
                  {params.page === 'Home' && <Home />}
                  {params.page === 'Products' && <Products />}
                  {params.page === 'History' && <History />}
                  {params.page === 'Mall' && <Mall />}
                </div>
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        ) : (
          <Grid centered style={{ marginTop: '50px' }}>
            <Grid.Row>
              <Card style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                <Card.Content>
                  <Card.Header style={{ color: '#333', marginBottom: '10px' }}>Welcome to DELIGHT</Card.Header>
                  <Card.Description style={{ color: '#555' }}>
                    "Delight empowers you to invest in premium dry fruits and earn daily income. Experience secure and rewarding growth with every bite."
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Row>
            <Grid.Row>
              <Button color='green' onClick={doLogin} style={{ marginTop: '20px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                <Icon name='google' />
                Login with Google
              </Button>
            </Grid.Row>
          </Grid>
        )}
        <Modal
          open={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          size='tiny'
          style={{ backgroundColor: 'grey' }}
          centered
        >
          <Modal.Header>FINANCIFY</Modal.Header>
          <Modal.Content>
            <p style={{ color: 'greenyellow', backgroundColor: 'gray', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>Hello, {user?.displayName}</p>
            <p style={{ color: 'yellow', backgroundColor: 'gray', padding: '5px', borderRadius: '4px' }}>
              "Effortlessly track your spending and income - stay organized with every transaction, every time."</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setUserModalOpen(false)}>Close</Button>
          </Modal.Actions>
        </Modal>
        <Modal
          open={logoutConfirmationOpen}
          onClose={() => setLogoutConfirmationOpen(false)}
          size='tiny'
          centered
        >
          <Modal.Header>Logout Confirmation</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to logout?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={doLogout}>Yes</Button>
            <Button onClick={() => setLogoutConfirmationOpen(false)}>No</Button>
          </Modal.Actions>
        </Modal>
      </MyContext.Provider>
    </div>
  );
}
