import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Container, Card } from 'react-bootstrap';

const UpdateCarga = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carga, setCarga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarga = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/cargas/${id}/`);
        setCarga(response.data);
        setLoading(false);
      } catch (err) {
        setError('No se pudo cargar la información de la carga.');
        setLoading(false);
      }
    };

    fetchCarga();
  }, [id]);

  const handleChange = (e) => {
    setCarga({ ...carga, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/cargas/${id}/`, carga);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar la carga.');
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ maxWidth: "600px", width: "100%" }} className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Actualizar Carga</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formOrigen">
              <Form.Label>Origen</Form.Label>
              <Form.Control
                name="origen"
                value={carga.origen}
                onChange={handleChange}
                required
                placeholder="Ingrese el origen"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDestino">
              <Form.Label>Destino</Form.Label>
              <Form.Control
                name="destino"
                value={carga.destino}
                onChange={handleChange}
                required
                placeholder="Ingrese el destino"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formKm">
              <Form.Label>Kilómetros</Form.Label>
              <Form.Control
                type="number"
                name="km"
                value={carga.km}
                onChange={handleChange}
                required
                placeholder="Cantidad de kilómetros"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formComision">
              <Form.Label>Comisión</Form.Label>
              <Form.Control
                type="number"
                name="comision"
                value={carga.comision}
                onChange={handleChange}
                required
                placeholder="Comisión aplicada"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPrecio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={carga.precio}
                onChange={handleChange}
                required
                placeholder="Precio total"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFormaPago">
              <Form.Label>Forma de Pago</Form.Label>
              <Form.Control
                name="forma_pago"
                value={carga.forma_pago}
                onChange={handleChange}
                required
                placeholder="Ej: Efectivo, Transferencia"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formDescripcionCarga">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion_carga"
                value={carga.descripcion_carga}
                onChange={handleChange}
                required
                placeholder="Descripción detallada de la carga"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Guardar Cambios
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdateCarga;
