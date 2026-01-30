// FIYAZ AHMED
import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

export default function Cancel() {
  return (
    <Container className="my-5 text-center">
      <Alert variant="danger">
        <h2>Payment Cancelled</h2>
        <p>You cancelled your payment. Would you like to try again?</p>
        <Button variant="primary" href="/cart">
          Back to Cart
        </Button>
      </Alert>
    </Container>
  );
}