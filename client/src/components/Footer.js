// FIYAZ AHMED
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#343a40", 
        color: "#f8f9fa", 
        padding: "2rem 0",
        marginTop: "auto", 
      }}
    >
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Find Us
            </h5>
            <p>
              <FaMapMarkerAlt className="me-2" />
              mohakhali, Dhaka, Bangladesh
            </p>
            <p>
              <FaPhone className="me-2" />
              +880 111 222 3333
            </p>
            <p>
              <FaEnvelope className="me-2" />
              <a
                href="mailto:contact@coffeeshop.com"
                style={{ color: "#f8f9fa", textDecoration: "none" }}
              >
                fiyazahmd002@gmail.com
              </a>
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Opening Hours
            </h5>
            <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
            <p>Sat - Sun: 9:00 AM - 6:00 PM</p>
          </Col>
          <Col md={4} className="mb-3">
            <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Get Directions
            </h5>
            <p>
              <a
                href="https://www.google.com/maps/place/NORTH+END+coffee+roasters+Roastery+%26+Cafe/@23.7712981,90.4005457,18z/data=!4m14!1m7!3m6!1s0x3755c711bd955fa9:0x372fff3108482c80!2sNORTH+END+coffee+roasters+Roastery+%26+Cafe!8m2!3d23.7712981!4d90.4018744!16s%2Fg%2F11vx1th23d!3m5!1s0x3755c711bd955fa9:0x372fff3108482c80!8m2!3d23.7712981!4d90.4018744!16s%2Fg%2F11vx1th23d?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#f8f9fa", textDecoration: "none" }}
              >
                View on Google Maps
              </a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p style={{ margin: 0 }}>
              &copy; {new Date().getFullYear()} Coffee Shop. All Rights Reserved to FIYAZ AHMED.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;