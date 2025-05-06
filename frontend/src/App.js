import React, { useState, useEffect } from 'react';
import {Container,Row,Col,Form,Button,Alert,Card,Table, Spinner} from 'react-bootstrap';
import {MapContainer,TileLayer,Marker,useMapEvents,} from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';


const CargasTable = () => {
  const [cargas, setCargas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener las cargas desde la API
    const fetchCargas = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/cargas/');
        setCargas(response.data);
        setLoading(false);
      } catch (err) {
        setError('Hubo un error al cargar los datos.');
        setLoading(false);
      }
    };

    fetchCargas();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="my-4">
      <h4>Cargas Disponibles</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Origen</th>
            <th>Destino</th>
            <th>Kilómetros</th>
            <th>Comisión</th>
            <th>Precio</th>
            <th>Forma de Pago</th>
            <th>Descripción de Carga</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {cargas.map((carga) => (
            <tr key={carga.id}>
              <td>{carga.origen}</td>
              <td>{carga.destino}</td>
              <td>{carga.km}</td>
              <td>{carga.comision}</td>
              <td>{carga.precio}</td>
              <td>{carga.forma_pago}</td>
              <td>{carga.descripcion_carga}</td>
              <td>{new Date(carga.fecha_creacion).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// Corrige íconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

function App() {
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

  const handleMapClick = (latlng) => {
    if (!origen) {
      setOrigen(latlng);
    } else if (!destino) {
      setDestino(latlng);
    } else {
      setOrigen(latlng);
      setDestino(null);
    }
  };

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
    console.log(data)
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
      // console.log(data)
      
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Error al enviar los datos.' });
    }
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>Selecciona Origen y Destino</Card.Header>
            <Card.Body>
              <MapContainer
                center={[-34.6, -58.4]}
                zoom={6}
                style={{ height: '400px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ClickHandler onMapClick={handleMapClick} />
                {origen && <Marker position={origen} />}
                {destino && <Marker position={destino} />}
              </MapContainer>
              <small className="text-muted">
                Haz clic una vez para elegir el origen y una segunda vez para el destino.
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <h4 className="mb-3">Formulario de Carga</h4>
          {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Kilómetros</Form.Label>
              <Form.Control
                type="number"
                value={formData.km}
                onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Comisión</Form.Label>
              <Form.Control
                type="number"
                value={formData.comision}
                onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Forma de Pago</Form.Label>
              <Form.Control
                type="text"
                value={formData.forma_pago}
                onChange={(e) => setFormData({ ...formData, forma_pago: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción de la Carga</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion_carga}
                onChange={(e) => setFormData({ ...formData, descripcion_carga: e.target.value })}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={!origen || !destino}
              className="w-100"
            >
              Crear Carga
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Aquí llamamos al componente CargasTable para mostrar las cargas */}
      <CargasTable />
    </Container>
  );
}

export default App;
export { CargasTable };
