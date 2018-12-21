export class Image {
  obj_id?: number;
  image_id?: string;
  file_name?: string;
  captions?: Caption[];
  url?: string;
  need_emotion?: boolean;
  height?: number;
  width?: number;
  date_captured?: Date;
}

export class Caption {
  id?: string;
  en?: string;
}

export class Meta {
  count?: number;
}

// export abstract class IMutation {
//   abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;
// }

export abstract class IQuery {
  abstract allImages(
    page?: number,
    limit?: number,
    search?: string,
  ): Image[] | Promise<Image[]>;

  abstract _allImagesMeta(): Meta;

  abstract image(id: string): Image | Promise<Image>;

  abstract temp__(): boolean | Promise<boolean>;
}

// export abstract class ISubscription {
//   abstract catCreated(): Cat | Promise<Cat>;
// }
