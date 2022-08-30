import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

// We create a Car Owners class
@nearBindgen
export class CarOwners {
  id: string;
  account: string;
  name: string;
  description: string;
  carIsAvailable: bool;
  price: u32;

  public static fromPayload(payload: CarOwners): CarOwners {
    const carOwner = new CarOwners();
    carOwner.id = payload.id;
    carOwner.account = context.sender;
    carOwner.name = payload.name;
    carOwner.description = payload.description;
    carOwner.carIsAvailable = payload.carIsAvailable;
    carOwner.price = payload.price;
    return carOwner;
  }
}
//   constructor(
//     id: string,
//     account: string,
//     name: string,
//     description: string,
//     carIsAvailable: bool,
//     price: u32
//   ) {
//     this.id = id;
//     this.account = account;
//     this.name = name;
//     this.description = description;
//     this.carIsAvailable = carIsAvailable;
//     this.price = price;
//   }
// }

// We also create a Car Users class
@nearBindgen
export class CarUsers {
  id: string;
  account: string;
  name: string;
  hasRented: bool;

  public static fromPayload(payload: CarUsers): CarUsers {
    const carUser = new CarUsers();
    carUser.id = payload.id;
    carUser.account = context.sender;
    carUser.name = payload.name;
    carUser.hasRented = payload.hasRented;
    return carUser;
  }
}

// We create two Unordered Maps in order to store info about car owners and users in our contract.
export const listedCarOwners = new PersistentUnorderedMap<string, CarOwners>(
  "o"
);
export const listedCarUsers = new PersistentUnorderedMap<string, CarUsers>("u");
