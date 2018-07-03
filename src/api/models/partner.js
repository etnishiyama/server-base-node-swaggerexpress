import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  docsInfo: {
    type: String,
  },
  logo: {
    type: String,
  },
  url: {
    type: String,
  },
  extra: {
    type: String,
  },
  _company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

partnerSchema.plugin(mongoosePaginate);

export default mongoose.model('Partner', partnerSchema);
