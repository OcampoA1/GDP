import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar, Proyectos, Sueldos, RRHH, Administracion, CajaMenorComponent, Movimientos, Compras } from './components/index';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-content1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/proyectos" element={<Proyectos />} />
              <Route path="/rrhh" element={<RRHH />} />
              <Route path="/sueldos" element={<Sueldos />} />
              <Route path="/movimientos" element={<Movimientos />} />
              <Route path="/caja-menor" element={<CajaMenorComponent />} />
              <Route path="/compras" element={<Compras />} />
              <Route path="/administracion" element={<Administracion />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

const Header: React.FC = () => {
  const location = useLocation();
  const getTitle = (path: string) => {
    switch(path) {
      case '/': return 'Dashboard';
      case '/proyectos': return 'Proyectos';
      case '/rrhh': return 'RRHH';
      case '/sueldos': return 'Sueldos';
      case '/movimientos': return 'Movimientos';
      case '/caja-menor': return 'Caja Menor';
      case '/compras': return 'Compras';
      case '/administracion': return 'Administración';
      default: return 'Dashboard';
    }
  }

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">{getTitle(location.pathname)}</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" variant="flat">
            <Icon icon="lucide:user" className="mr-2 h-4 w-4" />
            Perfil
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold mb-2">Resumen de Proyectos</h2>
          <p>Total de proyectos: XX</p>
          <p>Proyectos activos: XX</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold mb-2">Resumen de RRHH</h2>
          <p>Total de empleados: XX</p>
          <p>Equipos: XX</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold mb-2">Resumen Financiero</h2>
          <p>Presupuesto total: $XXXX</p>
          <p>Gastos totales: $XXXX</p>
        </CardBody>
      </Card>
    </div>
  );
}

export default App;