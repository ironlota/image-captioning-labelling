export interface JwtPayload {
  readonly username: string;
  readonly lastLogin: Date;
}
