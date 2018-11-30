import { Document } from 'mongoose';

export class Caption extends Document {
  readonly caption_id: number;
  readonly text: string;
}
