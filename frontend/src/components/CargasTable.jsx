import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CargasTable = () => {
  const [cargas, setCargas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/cargas/${id}/`);
      setCargas(cargas.filter(carga => carga.id !== id));
    } catch (err) {
      console.error('Error al eliminar la carga:', err);
      setError('No se pudo eliminar la carga.');
    }
  };

  const cargasFiltradas = cargas.filter(carga =>
    carga.origen.toLowerCase().includes(filtro.toLowerCase()) ||
    carga.destino.toLowerCase().includes(filtro.toLowerCase()) ||
    carga.descripcion_carga.toLowerCase().includes(filtro.toLowerCase())
  );

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

      <Form.Control
        type="text"
        placeholder="Buscar por origen, destino o descripción"
        className="mb-3"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

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
            <th>-</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {cargasFiltradas.map((carga) => (
            <tr key={carga.id}>
              <td>{carga.origen}</td>
              <td>{carga.destino}</td>
              <td>{carga.km}</td>
              <td>{carga.comision}</td>
              <td>{carga.precio}</td>
              <td>{carga.forma_pago}</td>
              <td>{carga.descripcion_carga}</td>
              <td>{new Date(carga.fecha_creacion).toLocaleString()}</td>
              <td><Button variant="danger" onClick={() => handleDelete(carga.id)}>Delete</Button></td>
              <td><Button variant="warning" onClick={() => navigate(`/update-carga/${carga.id}`)}>Update</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CargasTable;
