import { Exclude } from 'class-transformer';

export class User {
  username?: string;
  email?: string;
  @Exclude() password?: string;
  captionEditCount?: number;
  captionEdit?: [Caption];
  firstName?: string;
  lastName?: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export class Caption {
  caption_id?: number;
  text?: string;
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
