import express, { Request, Response } from "express";
import clientes, { Iclientes } from "../models/clientes";

const router2 = express.Router();

router2.get("/", async (req: Request, res: Response) => {

    try {
        const cliente: Iclientes[] = await clientes.find();
        res.json(cliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

})

router2.post("/nuevoCliente", async (req: Request, res: Response) => {
    const cliente = new clientes({
        _id: req.body.id,
        nombre: req.body.nombre,
        articuloAlquilado: req.body.articuloAlquilado,
        cantidad: req.body.cantidad,
        fechaDeDevolucion: req.body.fechaDeDevolucion
    })

    try {
        const newCliente: Iclientes = await cliente.save();
        res.status(201).json(newCliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
})


router2.put("/:id", async (req: Request, res: Response) => {

    try {
        const { _id, nombre, articuloAlquilado, cantidad, fechaDeDevolucion } = req.body;

        const cliente: Iclientes | null = await clientes.findByIdAndUpdate(req.params.id, {
            _id,
            nombre,
            articuloAlquilado,
            cantidad,
            fechaDeDevolucion
        }, { new: true });
        console.log(cliente);

        if (!cliente) {
            return res.status(201).json({
                ok: false,
                message: "cliente no encontrado"
            });
        }

        res.json(cliente);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error al actualizar el cliente"
        });
    }
})


router2.delete("/:id", async (req: Request, res: Response) => {
    try {
        const cliente: Iclientes | null = await clientes.findByIdAndDelete(req.params.id);

        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ message: "cliente not found" });
        }
    } catch (error) {
        console.log(error);
    }
})

export default router2;