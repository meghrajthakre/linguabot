import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BotSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        trainingData: { type: String },
        language: { type: String, default: 'en' },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Bot = model('Bot', BotSchema);
export default Bot;
