export class CreateImageDto {
  readonly image_id: number;
  readonly file_name: string;
  readonly captions: CreateCaptionDto[];
  readonly coco_url: string;
  readonly flickr_url: string;
  readonly height: number;
  readonly width: number;
  readonly date_captured: Date;
}

export class CreateCaptionDto {
  en: string;
  id: string;
}
