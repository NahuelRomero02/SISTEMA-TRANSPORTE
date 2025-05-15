import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MapForm = () => {
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [formData, setFormData] = useState({
    km: '',
    comision: '',
    precio: '',
    forma_pago: '',
    descripcion_carga: '',
  });
  const [alert, setAlert] = useState(null);

  // Manejador para cuando se hace clic en el mapa
  const handleMapClick = (latlng) => {
    if (!origen) {
      setOrigen(latlng);  // Seleccionamos el origen
    } else if (!destino) {
      setDestino(latlng);  // Seleccionamos el destino
    } else {
      setOrigen(latlng);  // Si ya se seleccionaron ambos, se reemplaza el origen
      setDestino(null);    // Limpiamos el destino
    }
  };

  // Componente para manejar el evento de clic en el mapa
  function LocationMarker() {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng);
      },
    });

    return (
      <>
        {origen && <Marker position={origen} icon={L.icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png' })} />}
        {destino && <Marker position={destino} icon={L.icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png' })} />}
      </>
    );
  }

  // Manejo del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origen || !destino) {
      setAlert({ variant: 'danger', message: 'Selecciona origen y destino en el mapa.' });
      return;
    }

    const data = {
      origen: `${origen.lat},${origen.lng}`,
      destino: `${destino.lat},${destino.lng}`,
      ...formData,
    };

    try {
      await axios.post('http://localhost:8000/api/cargas/', data);
      setAlert({ variant: 'success', message: 'Carga creada exitosamente.' });
      setOrigen(null);
      setDestino(null);
      setFormData({
        km: '',
        comision: '',
        precio: '',
        forma_pago: '',
        descripcion_carga: '',
      });
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Error al enviar los datos.' });
    }
  };

  return (
  <Container className="mt-4">
    <Row>
      <Col md={6}>
        <Card className="bg-dark text-light shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Selecciona los puntos de origen y destino</h5>
          </Card.Header>
          <Card.Body>
            <MapContainer center={[19.4326, -99.1332]} zoom={6} style={{ width: '100%', height: '400px', borderRadius: '10px' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="bg-dark text-light shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Formulario de Carga</h5>
          </Card.Header>
          <Card.Body>
            {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formKm" className="mb-3">
                <Form.Label>Kilómetros</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.km}
                  onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formComision" className="mb-3">
                <Form.Label>Comisión</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.comision}
                  onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPrecio" className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formFormaPago" className="mb-3">
                <Form.Label>Forma de Pago</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.forma_pago}
                  onChange={(e) => setFormData({ ...formData, forma_pago: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDescripcionCarga" className="mb-3">
                <Form.Label>Descripción de la Carga</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.descripcion_carga}
                  onChange={(e) => setFormData({ ...formData, descripcion_carga: e.target.value })}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Crear Carga
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);
};

export default MapForm;
