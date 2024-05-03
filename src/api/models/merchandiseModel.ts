// Schema for category model
import mongoose from 'mongoose';
import {Merchandise} from '../../types/DBTypes';

const merchandiseSchema = new mongoose.Schema<Merchandise>({
  merchandise_name: {
    type: String,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required.']
  },
  filename: {
    type: String,
    required: [true, 'Image is required.'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required.'],
  },
});

export default mongoose.model<Merchandise>('Merchandise', merchandiseSchema);
