import React, { useState, useContext } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ref, push } from 'firebase/database';
import { db } from './firebase';
import { Grid, Card, Image, Button, Header, Segment, Modal } from 'semantic-ui-react';
import { MyContext } from '../App';

const Products = () => {
  const { user } = useContext(MyContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Default products with updated price range
  const products = [
    { id: 1, name: 'Almonds', price: 500, period: '30 days', dailyProfit: 25, image: 'https://via.placeholder.com/150?text=Almonds' },
    { id: 2, name: 'Cashews', price: 750, period: '30 days', dailyProfit: 30, image: 'https://via.placeholder.com/150?text=Cashews' },
    { id: 3, name: 'Walnuts', price: 1000, period: '30 days', dailyProfit: 35, image: 'https://via.placeholder.com/150?text=Walnuts' },
    { id: 4, name: 'Pistachios', price: 850, period: '30 days', dailyProfit: 28, image: 'https://via.placeholder.com/150?text=Pistachios' },
    { id: 5, name: 'Raisins', price: 600, period: '30 days', dailyProfit: 20, image: 'https://via.placeholder.com/150?text=Raisins' },
    { id: 6, name: 'Dates', price: 800, period: '30 days', dailyProfit: 25, image: 'https://via.placeholder.com/150?text=Dates' },
    { id: 7, name: 'Hazelnuts', price: 1200, period: '30 days', dailyProfit: 40, image: 'https://via.placeholder.com/150?text=Hazelnuts' },
    { id: 8, name: 'Apricots', price: 950, period: '30 days', dailyProfit: 30, image: 'https://via.placeholder.com/150?text=Apricots' },
  ];

  const handleBuy = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const confirmPurchase = () => {
    const purchaseRef = ref(db, `history/${user.uid}`);
    push(purchaseRef, selectedProduct);
    setModalOpen(false);
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Segment padded='very' raised>
        <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Available Products</Header>
        <Grid columns={2} unstackable>
          {products.map(product => (
            <Grid.Column key={product.id} mobile={8} tablet={8} computer={4}>
              <Card>
                <Image src={product.image} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{product.name}</Card.Header>
                  <Card.Meta>Price: ₹{product.price}</Card.Meta>
                  <Card.Meta>Period: {product.period}</Card.Meta>
                  <Card.Meta>Daily Profit: ₹{product.dailyProfit}</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <Button color='green' fluid onClick={() => handleBuy(product)}>
                    Buy Now
                  </Button>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </Segment>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size='tiny'
        centered
      >
        <Modal.Header>Confirm Purchase</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to purchase {selectedProduct?.name} for ₹{selectedProduct?.price}?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color='green' onClick={confirmPurchase}>Confirm</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Products;
