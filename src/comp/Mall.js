import React from 'react';
import { Card, Image } from 'semantic-ui-react';

export default function Mall() {
  const products = [
    { name: 'Almonds', price: '$10', image: 'https://via.placeholder.com/150' },
    { name: 'Cashews', price: '$15', image: 'https://via.placeholder.com/150' },
    { name: 'Pistachios', price: '$12', image: 'https://via.placeholder.com/150' },
    { name: 'Walnuts', price: '$18', image: 'https://via.placeholder.com/150' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mall - Explore Products</h2>
      <Card.Group>
        {products.map((product, index) => (
          <Card key={index}>
            <Image src={product.image} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{product.name}</Card.Header>
              <Card.Meta>{product.price}</Card.Meta>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
}
