import { Document } from 'mongoose';

export interface Image extends Document {
  readonly image_id: number;
  readonly file_name: string;
  readonly coco_url: string;
  readonly flickr_url: string;
  readonly height: number;
  readonly width: number;
  readonly date_captured: Date;
}
