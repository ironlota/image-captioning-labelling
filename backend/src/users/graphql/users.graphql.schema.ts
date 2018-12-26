import { Exclude } from 'class-transformer';

export class User {
  username?: string;
  email?: string;
  @Exclude() password?: string;
  step?: number;
  range?: string;
  captionEditCount?: number;
  captionCuratedCount?: number;
  captionEmotionCount?: number;
  captions?: [Caption];
  firstName?: string;
  lastName?: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export class Caption {
  obj_id: number;
  image_id: string;
  curatedCaptions: [number];
  captionEdit: [CaptionEdit];
  captionEmotion: CaptionEmotion;
}

export class CaptionEdit {
  caption_id?: number;
  text?: string;
}

export class CaptionEmotion {
  happy?: string;
  sad?: string;
  angry?: string;
}

export class CreateUserInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class EditCaption {
  caption_id: number;
  text: string;
}

export abstract class IMutation {
  abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;
  abstract editCaption(createEditCaption: EditCaption): User | Promise<User>;
  abstract changePassword(
    oldPassword: string,
    newPassword: string,
  ): User | Promise<User>;
}

export class Meta {
  count?: number;
}

export abstract class IQuery {
  abstract allImages(page?: number, limit?: number): User[] | Promise<User[]>;

  abstract _allImagesMeta(): Meta;

  abstract user(username: string): User | Promise<User>;

  abstract temp__(): boolean | Promise<boolean>;
}
