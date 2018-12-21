import { Document } from 'mongoose';

export interface Image extends Document {
  readonly image_id: string;
  readonly file_name: string;
  readonly url: string;
  readonly height: number;
  readonly width: number;
  readonly date_captured: Date;
}
