import * as mongoose from 'mongoose';

export const CaptionSchema = new mongoose.Schema({
  en: { type: String },
  id: { type: String },
  caption_id: { type: String },
});

CaptionSchema.index({ en: 'text', id: 'text' });

export const ImagesSchema = new mongoose.Schema({
  obj_id: { type: Number },
  image_id: { type: Number },
  captions: [CaptionSchema],
  file_name: { type: String },
  coco_url: { type: String },
  flickr_url: { type: String },
  height: { type: Number },
  width: { type: Number },
  date_captured: { type: Date, default: Date.now },
});

ImagesSchema.index({ 'captions.$.id': 'text', 'captions.$.en': 'text' });
