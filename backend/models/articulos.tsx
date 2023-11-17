import mongoose, { Schema, Document } from "mongoose";

export interface Iarticulos extends Document {
    articulo: string;
    alquiler: number;
    cantidad: number;
    status: string;
}

const articulosSchema: Schema = new Schema({
    articulo: { type: String, required: true },
    alquiler: { type: Number},
    cantidad: { type: Number},
    status: { type: String},

});

export default mongoose.model<Iarticulos>("Articulos", articulosSchema);