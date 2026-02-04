export enum Roles {
  ADMIN = "ADMIN",
  CREATOR = "CREATOR",
  BUYER = "BUYER"
}

// string union that represents the same possible values as the enum
export type Role = `${Roles}`;
