// FIYAZ AHMED
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function FindUs() {
  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center" style={{ fontWeight: 'bold', color: '#333' }}>Find Us</h1>
      <Row>
        <Col md={6}>
          <h3>Contact Information</h3>
          <p><strong>Phone:</strong> +1-123-456-7890</p>
          <p><strong>Email:</strong> fiyazahmd002@gmail.com</p>
          <p><strong>Address:</strong> mohakhali, Dhaka, Bangladesh</p>
        </Col>
        <Col md={6}>
          <h3>Store Locations</h3>
          <ul>
            <li>Dhaka Store: mohakhali, Dhaka</li>
            <li>Chittagong Store: 456 boddarhat, Chittagong</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}