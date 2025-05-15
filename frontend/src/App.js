import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import CargasTable from './components/CargasTable.jsx';
import UpdateCarga from './components/UpdateCargas.jsx';
import MapForm from './components/MapForm.jsx';

// Definimos el componente Home directamente aquí
function Home() {
  return (
    <Container className="bg-dark text-light shadow-sm p-4 rounded">
      <h1 className="text-center mb-4">Bienvenido a la plataforma de cargas</h1>
      <MapForm />
      <CargasTable />
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige "/" a "/home" */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Ruta principal actual */}
        <Route path="/home" element={<Home />} />

        {/* Ruta para editar carga */}
        <Route path="/update-carga/:id" element={<UpdateCarga />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
