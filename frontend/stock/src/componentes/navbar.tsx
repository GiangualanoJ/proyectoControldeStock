import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

export default function Navbar() {
    const items: MenuItem[] = [
        {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
            url: '/'
        },
        {
            label: 'Artículos',
            icon: 'pi pi-fw pi-list',
            url: '/componentes/articulos'
        },
        {
            label: 'Clientes',
            icon: 'pi pi-fw pi-user',
            url: '/componentes/clientes'
        },
    ];

    return (
        <div>
            <Menubar model={items} />
        </div>
    )
}
