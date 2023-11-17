import express, { Request, Response } from "express";
import Articulos, { Iarticulos } from "../models/articulos";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {

    try {
        const articulos: Iarticulos[] = await Articulos.find();
        res.json(articulos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

})

router.post("/nuevoArticulo", async (req: Request, res: Response) => {
    const articulos = new Articulos({
        _id: req.body.id,
        articulo: req.body.articulo,
        alquiler: req.body.alquiler,
        cantidad: req.body.cantidad,
        status: req.body.status
    })

    try {
        const newArticulos: Iarticulos = await articulos.save();
        res.status(201).json(newArticulos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
})


router.put("/:id", async (req: Request, res: Response) => {

    try {
        console.log(req.params)
        const { _id, articulo, alquiler, cantidad, status } = req.body;

        const articulo1: Iarticulos | null = await Articulos.findByIdAndUpdate(req.params.id, {
            _id,
            articulo,
            alquiler,
            cantidad,
            status
        }, { new: true });
        console.log(articulo1);
        

        if (!articulo1) {
            return res.status(201).json({
                ok: false,
                message: "articulo no encontrado"
            });
        }

        res.json(articulo1);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error al actualizar el artículo"
        });
    }
})


router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const articulos: Iarticulos | null = await Articulos.findByIdAndDelete(req.params.id);

        if (articulos) {
            res.json(articulos);
        } else {
            res.status(404).json({ message: "Articulos not found" });
        }
    } catch (error) {
        console.log(error);
    }
})

export default router;