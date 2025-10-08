import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    pass: { type: String, required: true },
    appName: { type: String, required: false },
},
    { timestamps: true }

);

export default mongoose.models.Store || mongoose.model("Store", StoreSchema);