import { Document } from 'mongoose';

export class CaptionEdit extends Document {
  readonly caption_id: number;
  readonly text: string;
}

export class CaptionEmotion extends Document {
  readonly happy: string;
  readonly sad: string;
  readonly angry: string;
}

export class Caption extends Document {
  readonly obj_id: number;
  readonly image_id: string;
  readonly curatedCaptions: [number];
  readonly captionEdit: [CaptionEdit];
  readonly captionEmotion: CaptionEmotion;
}
