import React, { useState, useEffect, useRef, RefObject, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import produce from 'immer';
import ClientesBar from './clientesBar';
import { Calendar } from 'primereact/calendar';

interface Iclientes {
    _id: string | null;
    nombre: string;
    articuloAlquilado: string;
    cantidad: number | null;
    fechaDeDevolucion: Date;
    [key: string]: string | number | null | Date;
}



export default function Clientes() {

    let emptyCliente: Iclientes = {
        _id: null,
        nombre: '',
        articuloAlquilado: '',
        cantidad: null,
        fechaDeDevolucion: new Date(),
    };


    const [clientes, setClientes] = useState<Iclientes[]>([]);
    const [cliente, setCliente] = useState<Iclientes>(emptyCliente);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [productDialog, setProductDialog] = useState<boolean>(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState<boolean>(false);
    const [nombre, setNombre] = useState<string>();
    const [articuloAlquilado, setArticuloAlquilado] = useState<string>();
    const [cantidad, setCantidad] = useState<number>();
    const toast = useRef<RefObject<any>>(null);

    useEffect(() => {
        const getClientes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/clientes');
                setClientes(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getClientes();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (cliente._id) {
                const response = await axios.put(`http://localhost:3000/clientes/${cliente._id}`, {
                    nombre: cliente.nombre,
                    articuloAlquilado: cliente.articuloAlquilado,
                    cantidad: cliente.cantidad,
                    fechaDeDevolucion: cliente.fechaDeDevolucion,
                });
                setClientes(clientes.map((articulo) => cliente._id === response.data._id ? { ...response.data } : cliente));
                setSubmitted(true);
                setProductDialog(false);
                setCliente(emptyCliente);
            } else {
                const response = await axios.post('http://localhost:3000/clientes/nuevoCliente', cliente);
                const newCliente = response.data;
                setClientes([...clientes, newCliente]);
                /* toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Reserva creada', life: 3000 }); */
            }
            hideDialog();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCliente = async (a: Iclientes) => {
        try {
            await axios.delete(`http://localhost:3000/clientes/${a._id}`);
            setClientes(clientes.filter((cliente) => cliente._id !== a._id));
        } catch (error) {
            console.log(error);
        }
    }

    const openNew = () => {
        setCliente(emptyCliente);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const confirmDeleteProduct = (cliente: Iclientes) => {
        setCliente(cliente);
        setDeleteProductDialog(true);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _cliente = { ...cliente };

        _cliente[`${name}`] = val;

        setCliente(_cliente);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        const originalEvent = e.originalEvent as React.SyntheticEvent<Element, Event>;

        if (originalEvent) {
            originalEvent.preventDefault();
        }

        setCliente(produce(cliente, (draft) => {
            draft[name] = val;
        }));
    };

    const handleFechaDeDevolucionChange = (e: FormEvent<Calendar>) => {
        const selectedDate = (e.target as unknown as { date: Date }).date;
        if (selectedDate) {
            setCliente({ ...cliente, fechaDeDevolucion: selectedDate });
        }
    };

    const editCliente = (cliente: Iclientes) => {
        const fechaDeDevolucion = cliente.fechaDeDevolucion instanceof Date ? cliente.fechaDeDevolucion.toISOString().split('T')[0] : cliente.fechaDeDevolucion;

        setCliente({
            ...cliente,
            fechaDeDevolucion: new Date(fechaDeDevolucion)
        });
        setProductDialog(true);
    };

    const startContent = (
        <React.Fragment>
            <Button label="New" text raised rounded icon="pi pi-plus" onClick={openNew} />
            <i className="pi pi-bars p-toolbar-separator mx-3" />
            <Button label="Update" text raised rounded icon="pi pi-upload" className="p-button-success" />
        </React.Fragment>
    );

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Listado de Clientes</span>
            <Button icon="pi pi-refresh" rounded raised />
        </div>
    );

    const actionBodyTemplate = (rowData: Iclientes) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCliente(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
        </React.Fragment>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => deleteCliente(cliente)} />
        </React.Fragment>
    );

    const footer = `En total hay ${clientes ? clientes.length : 0} artículos.`;


    return (
        <div>
            <div>
                <ClientesBar />
            </div>

            <div className="card">
                <Toolbar start={startContent} />
                <DataTable value={clientes} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="_id" header="ID"></Column>
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="articuloAlquilado" header="Artículo Alquilado"></Column>
                    <Column field="cantidad" header="Cantidad"></Column>
                    <Column field='fechaDeDevolucion' header="Fecha de Devolución"></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>

            <form onSubmit={handleSubmit}>
                <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Cliente" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="nombre" className="font-bold">
                            Nombre
                        </label>
                        <InputText id="nombre" value={cliente.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !cliente.nombre })} />
                        {submitted && !cliente.nombre && <small className="p-error">nombre is required.</small>}
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="articuloAlquilado" className="font-bold">
                                Artículo Alquilado
                            </label>
                            <InputText id="articuloAlquilado" value={cliente.articuloAlquilado} onChange={(e) => onInputChange(e, 'articuloAlquilado')} />
                        </div>
                        <div className="field col">
                            <label htmlFor="cantidad" className="font-bold">
                                Cantidad
                            </label>
                            <InputNumber id="cantidad" value={cliente.cantidad} onValueChange={(e) => onInputNumberChange(e, 'cantidad')} />
                        </div>
                    </div>
                    <div className="field">
                            <label htmlFor="fechaDeDevolucion" className="font-bold">
                                Fecha de Devolución
                            </label>
                            <Calendar
                                id="fechaDeDevolucion"
                                dateFormat="yy/mm/dd"
                                value={cliente.fechaDeDevolucion}
                                onChange={(e) => handleFechaDeDevolucionChange(e as unknown as FormEvent<Calendar>)}
                            />
                        </div>

                </Dialog>
            </form>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {cliente && (
                        <span>
                            Are you sure you want to delete <b>{cliente.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>


    )
}