import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const addressSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  street: {
    type: String,
    required: true,
  },
  addressNumber: {
    type: String,
    required: true,
  },
  complement: {
    type: String,
  },
  cep: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  cityState: {
    type: String,
  },
  country: {
    type: String,
  },
  location: {
    type: [Number],
    index: '2d',
  },
  _company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

addressSchema.plugin(mongoosePaginate);

export default mongoose.model('Address', addressSchema);
