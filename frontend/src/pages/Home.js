import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import products from '../data/products';
import heroBg from '../assets/images/fondoTienda.png';

const Home = () => {
  return (
    <div>
      <section
        className="container-hero mb-4"
        style={{
          backgroundImage: `linear-gradient(rgba(7,8,18,0.6), rgba(7,8,18,0.6)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        <Container>
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between">
            <div>
              <h1 className="hero-title display-5">Tecnovision <span className="neon-text">Gaming</span></h1>
              <p className="hero-subtitle">Equipo y accesorios para jugadores exigentes — rendimiento y estilo.</p>
              <div className="d-flex hero-cta mt-3">
                <Button className="btn-neon me-2">Tienda</Button>
                <Button variant="outline-light">Novedades</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <h2 className="h5 mb-3">Productos destacados</h2>
        <Row xs={1} sm={2} md={3} className="g-4">
          {products.map((p) => (
            <Col key={p.id}>
              <Card className="h-100 gamer-card gamer-glow">
                <Card.Img variant="top" src={p.image} alt={p.name} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-white">{p.name}</Card.Title>
                  <Card.Text className="text-muted small">{p.description}</Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div className="price-badge">${p.price.toFixed(2)}</div>
                    <Button className="btn-neon" size="sm">Comprar</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
