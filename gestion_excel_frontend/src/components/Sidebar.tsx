import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'lucide:home', label: 'Dashboard' },
    { path: '/proyectos', icon: 'lucide:briefcase', label: 'Proyectos' },
    { path: '/rrhh', icon: 'lucide:users', label: 'RRHH' },
    { path: '/sueldos', icon: 'lucide:dollar-sign', label: 'Sueldos' },
    { path: '/movimientos', icon: 'lucide:move', label: 'Movimientos' },
    { path: '/caja-menor', icon: 'lucide:box', label: 'Caja Menor' },
    { path: '/compras', icon: 'lucide:shopping-cart', label: 'Compras' },
    { path: '/administracion', icon: 'lucide:settings', label: 'Administración' },
  ];

  return (
    <aside className="w-64 bg-content2 text-foreground p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            as={Link}
            to={item.path}
            variant="flat"
            color={location.pathname === item.path ? "primary" : "default"}
            className="w-full justify-start"
          >
            <Icon icon={item.icon} className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
};