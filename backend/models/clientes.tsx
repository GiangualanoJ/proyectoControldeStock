import mongoose, { Schema, Document } from "mongoose";

export interface Iclientes extends Document {
    nombre: string;
    articuloAlquilado: string;
    cantidad: number;
    fechaDeDevolucion: Date;

}

const clientesSchema: Schema = new Schema({
    nombre: { type: String, required: true },
    articuloAlquilado: { type: String, required: true },
    cantidad: { type: Number, required: true },
    fechaDeDevolucion: { type: Date, required: true },
});

export default mongoose.model<Iclientes>("clientes", clientesSchema);