import React, { useState, useEffect, useRef, RefObject } from 'react';
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

interface Iarticulos {
    _id: string | null;
    articulo: string;
    alquiler: number | null;
    cantidad: number | null;
    status: string;
    [key: string]: string | number | null;
}

export default function Articulos() {

    let emptyArticulo: Iarticulos = {
        _id: null,
        articulo: '',
        alquiler: null,
        cantidad: null,
        status: 'INSTOCK',
    };


    const [articulos, setArticulos] = useState<Iarticulos[]>([]);
    const [articulo1, setArticulo1] = useState<Iarticulos>(emptyArticulo);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [productDialog, setProductDialog] = useState<boolean>(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState<boolean>(false);
    const [articulo, setArticulo] = useState<string>();
    const [alquiler, setAlquiler] = useState<number>();
    const [cantidad, setCantidad] = useState<number>();
    const [status, setStatus] = useState<string>();
    const toast = useRef<RefObject<any>>(null);

    useEffect(() => {
        const getArticulos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/articulos');
                setArticulos(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getArticulos();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (articulo1._id) {
                const response = await axios.put(`http://localhost:3000/articulos/${articulo1._id}`, {
                  articulo: articulo1.articulo,
                  alquiler: articulo1.alquiler,
                  cantidad: articulo1.cantidad,
                  status: articulo1.status,
                });
                setArticulos(articulos.map((articulo) => articulo._id === response.data._id ? { ...response.data } : articulo));
                setSubmitted(true);
                setProductDialog(false);
                setArticulo1(emptyArticulo);
            } else {
                const response = await axios.post('http://localhost:3000/articulos/nuevoArticulo', articulo1);
                const newArticulo = response.data;
                setArticulos([...articulos, newArticulo]);
                /* toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Reserva creada', life: 3000 }); */
            }
            hideDialog();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteArticulo = async (a: Iarticulos) => {
        try {
            await axios.delete(`http://localhost:3000/articulos/${a._id}`);
            setArticulos(articulos.filter((articulo) => articulo._id !== a._id));
        } catch (error) {
            console.log(error);
        }
    }

    const openNew = () => {
        setArticulo1(emptyArticulo);
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

    const editProduct = (articulo: Iarticulos) => {
        setArticulo1({ ...articulo });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (articulo: Iarticulos) => {
        setArticulo1(articulo);
        setDeleteProductDialog(true);
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _articulo1 = { ...articulo1 };

        _articulo1['status'] = e.value;
        setArticulo1(_articulo1);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _articulo1 = { ...articulo1 };

        _articulo1[`${name}`] = val;

        setArticulo1(_articulo1);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        const originalEvent = e.originalEvent as React.SyntheticEvent<Element, Event>;

        if (originalEvent) {
            originalEvent.preventDefault();
        }

        setArticulo1(produce(articulo1, (draft) => {
            draft[name] = val;
        }));
    };

    const formatCurrency = (value: number | null) => {
        if (value === null) {
            return '';
        }
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    };

    const priceBodyTemplate = (articulo: Iarticulos) => {
        return formatCurrency(articulo.alquiler);
    };

    const statusBodyTemplate = (articulo: Iarticulos) => {
        return <Tag value={articulo.status} severity={getSeverity(articulo)}></Tag>;
    };

    const getSeverity = (articulo: Iarticulos) => {
        switch (articulo.status) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
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
            <span className="text-xl text-900 font-bold">Listado de Artículos</span>
            <Button icon="pi pi-refresh" rounded raised />
        </div>
    );

    const actionBodyTemplate = (rowData: Iarticulos) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
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
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => deleteArticulo(articulo1)} />
        </React.Fragment>
    );

    const footer = `En total hay ${articulos ? articulos.length : 0} artículos.`;

    return (
        <div>
            <div className="card">
                <Toolbar start={startContent} />
                <DataTable value={articulos} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="_id" header="ID"></Column>
                    <Column field="articulo" header="Artículo"></Column>
                    <Column field="alquiler" header="Alquiler" body={priceBodyTemplate}></Column>
                    <Column field="cantidad" header="Catidad"></Column>
                    <Column header="Status" body={statusBodyTemplate}></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>

            <form onSubmit={handleSubmit}>
                <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Artículo" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="articulo" className="font-bold">
                            Name
                        </label>
                        <InputText id="articulo" value={articulo1.articulo} onChange={(e) => onInputChange(e, 'articulo')} required autoFocus className={classNames({ 'p-invalid': submitted && !articulo1.articulo })} />
                        {submitted && !articulo1.articulo && <small className="p-error">Articulo is required.</small>}
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="alquiler" className="font-bold">
                                Alquiler
                            </label>
                            <InputNumber id="alquiler" value={articulo1.alquiler} onValueChange={(e) => onInputNumberChange(e, 'alquiler')} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="field col">
                            <label htmlFor="cantidad" className="font-bold">
                                Cantidad
                            </label>
                            <InputNumber id="cantidad" value={articulo1.cantidad} onValueChange={(e) => onInputNumberChange(e, 'cantidad')} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="mb-3 font-bold">Status</label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="category1" name="category" value="INSTOCK" onChange={onCategoryChange} checked={articulo1.status === 'INSTOCK'} />
                                <label htmlFor="category1">INSTOCK</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="category2" name="category" value="LOWSTOCK" onChange={onCategoryChange} checked={articulo1.status === 'LOWSTOCK'} />
                                <label htmlFor="category2">LOWSTOCK</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="category3" name="category" value="OUTOFSTOCK" onChange={onCategoryChange} checked={articulo1.status === 'OUTOFSTOCK'} />
                                <label htmlFor="category3">OUTOFSTOCK</label>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </form>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {articulo1 && (
                        <span>
                            Are you sure you want to delete <b>{articulo1.articulo}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
