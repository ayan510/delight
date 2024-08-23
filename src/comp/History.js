import React, { useState, useEffect, useContext } from 'react';
import { ref, onValue, update } from 'firebase/database';
import 'semantic-ui-css/semantic.min.css';
import { db } from './firebase';
import { Button, Segment, Label, Modal, Header, Grid, Card, Message, Form } from 'semantic-ui-react';
import { MyContext } from '../App';

const History = () => {
  const { user } = useContext(MyContext);
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(500); // Example wallet balance
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [redeemCodeModalOpen, setRedeemCodeModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  useEffect(() => {
    const transactionsRef = ref(db, 'transactions/' + user.uid);
    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transactionsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setTransactions(transactionsArray);
      } else {
        setTransactions([]);
      }
    });
  }, [user.uid]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleShowProducts = () => {
    setShowProducts(true);
  };

  const handleRecharge = () => {
    setRechargeModalOpen(true);
  };

  const handleRechargeConfirm = () => {
    // Simulate a recharge operation
    const newBalance = walletBalance + 1000; // Example: add 1000 INR
    setWalletBalance(newBalance);
    setRechargeModalOpen(false);
    alert('Recharge successful!');
  };

  const handleRedeemCode = () => {
    setRedeemCodeModalOpen(true);
  };

  const handleRedeemConfirm = () => {
    // Simulate redeeming a code
    alert(`Code ${redeemCode} redeemed successfully!`);
    setRedeemCodeModalOpen(false);
    setRedeemCode('');
  };

  const handleWithdrawal = () => {
    setWithdrawalModalOpen(true);
  };

  const handleWithdrawalConfirm = () => {
    // Simulate a withdrawal operation
    if (withdrawalAmount > walletBalance) {
      alert('Insufficient balance!');
    } else {
      const newBalance = walletBalance - withdrawalAmount;
      setWalletBalance(newBalance);
      alert(`Withdrawal of ${withdrawalAmount} INR successful!`);
    }
    setWithdrawalModalOpen(false);
    setWithdrawalAmount('');
  };

  const handleContactUs = () => {
    setContactModalOpen(true);
  };

  const handleContactUsConfirm = () => {
    // Simulate sending a contact request
    alert('Contact request sent!');
    setContactModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: 'whitesmoke', padding: '20px' }}>
      <Header as='h2' textAlign='center' color='teal'>
        Welcome, {user.displayName}!
      </Header>

      <Grid columns={3} divided stackable>
        <Grid.Row>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h4'>Wallet Balance</Header>
              <Label color='teal' size='big'>
                ₹{walletBalance}
              </Label>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h4'>Recharge</Header>
              <Button primary fluid onClick={handleRecharge}>
                Recharge
              </Button>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h4'>Gift Code</Header>
              <Button color='yellow' fluid onClick={handleRedeemCode}>
                Redeem Code
              </Button>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button color='green' fluid onClick={handleWithdrawal}>
              Withdrawal
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button color='blue' fluid onClick={handleShowProducts}>
              My Products
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h4'>Customer Care</Header>
              <Button color='red' fluid onClick={handleContactUs}>
                Contact Us
              </Button>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {showProducts && (
        <>
          <Header as='h3' style={{ marginTop: '40px' }}>
            My Products
          </Header>
          {transactions.length === 0 ? (
            <Message>
              <Message.Header>No Products Purchased Yet</Message.Header>
              <p>Start buying products to see them here!</p>
            </Message>
          ) : (
            <Card.Group>
              {transactions.map((transaction) => (
                <Card key={transaction.id} onClick={() => handleProductClick(transaction)}>
                  <Card.Content>
                    <Card.Header>{transaction.category}</Card.Header>
                    <Card.Meta>{transaction.type}</Card.Meta>
                    <Card.Description>
                      <strong>Amount: </strong>₹{transaction.amount}
                    </Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          )}
        </>
      )}

      {selectedProduct && (
        <Modal open={showProductModal} onClose={handleCloseProductModal} size='small'>
          <Modal.Header>Product Details</Modal.Header>
          <Modal.Content>
            <p><strong>Type: </strong>{selectedProduct.type}</p>
            <p><strong>Amount: </strong>₹{selectedProduct.amount}</p>
            <p><strong>Category: </strong>{selectedProduct.category}</p>
            {/* Add more details if available */}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCloseProductModal} color='green'>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      )}

      <Modal open={rechargeModalOpen} onClose={() => setRechargeModalOpen(false)} size='small'>
        <Modal.Header>Recharge Wallet</Modal.Header>
        <Modal.Content>
          <p>Confirm to add funds to your wallet.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={handleRechargeConfirm}>
            Confirm
          </Button>
          <Button onClick={() => setRechargeModalOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>

      <Modal open={redeemCodeModalOpen} onClose={() => setRedeemCodeModalOpen(false)} size='small'>
        <Modal.Header>Redeem Gift Code</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='Enter Gift Code'
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={handleRedeemConfirm}>
            Redeem
          </Button>
          <Button onClick={() => setRedeemCodeModalOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>

      <Modal open={withdrawalModalOpen} onClose={() => setWithdrawalModalOpen(false)} size='small'>
        <Modal.Header>Withdrawal</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='Enter Amount'
              type='number'
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={handleWithdrawalConfirm}>
            Withdraw
          </Button>
          <Button onClick={() => setWithdrawalModalOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>

      <Modal open={contactModalOpen} onClose={() => setContactModalOpen(false)} size='small'>
        <Modal.Header>Contact Us</Modal.Header>
        <Modal.Content>
          <p>For support, please contact us at support@delight.com or call us at +917337***401. Yours Ayan510</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={handleContactUsConfirm}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default History;
