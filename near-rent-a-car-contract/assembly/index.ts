/**
 * IMPORT STATEMENTS
 */

import { logging, context, u128, ContractPromiseBatch } from "near-sdk-as";
import { CarOwners, CarUsers, listedCarOwners, listedCarUsers } from "./model";

/**
 * CONSTANTS
 */

const ONE_NEAR = u128.from("1000000000000000000000000");

/** CONTRACT FUNCTIONS */

/**
 * This is a WRITE function to register a new CarOwners.
 *
 * @param name string that requires the name of the owner to register.
 * @param carIsAvailable boolean that determines wheter or no the owner has his car available
 * (in this first version of the dApp it is assumed that each owner will only offer one car)
 * @param price 32 bits unsigned integer that requires the price to pay for the rental.
 *
 * It's required to send at least 1 NEAR as deposit payment to call this function.
 */
export function setCarOwner(carOwner: CarOwners): void {
  // We use the transaction context to obtain useful data.
  const deposit = context.attachedDeposit;
  const priceInt = u128.mul(ONE_NEAR, u128.from(carOwner.price));
  // We require that:
  //* the name length be greater or equal than 3.
  //* the car owners pays 1 NEAR each time they register.
  //* the rental price be greater than 1 NEAR.
  assert(carOwner.name.length >= 3, "The name must have 3 or more characters.");
  assert(deposit >= ONE_NEAR, "You must pay 1 NEAR to register.");
  assert(priceInt > ONE_NEAR, "Rental price must be greater than 1 NEAR.");

  // We store the data.
  listedCarOwners.set(carOwner.id, CarOwners.fromPayload(carOwner));

  // We send a confirmation message.
  logging.log("Car owner successfully registered.");
}

/**
 * READ function that returns a carOwners.
 *
 * @param account string that contains the owner account to check.
 * @returns CarOwners
 */
export function getCarOwner(account: string): CarOwners | null {
  return listedCarOwners.get(account);
}

/**
 * READ function that returns the entire array of registered car owners.
 *
 * @returns CarOwners[]
 */
export function getCarOwners(): CarOwners[] {
  return listedCarOwners.values();
}

// These functions are similar to the previous ones but related to users.

export function setCarUser(carUser: CarUsers): void {
  // We use the transaction context to obtain useful data.
  const deposit = context.attachedDeposit;

  // We require that:
  //* the name length be greater or equal than 3.
  //* the car users pays 1 NEAR each time they register.
  assert(carUser.name.length >= 3, "The name must have 3 or more characters.");
  assert(deposit >= ONE_NEAR, "You must pay 1 NEAR to register.");

  // We store the data and send a confirmation message.
  listedCarUsers.set(carUser.id, CarUsers.fromPayload(carUser));
  logging.log("Car user successfully registered.");
}

/**
 * READ function that returns a carUsers.
 * @param account string that contains the user account to check.
 * @returns CarOwners
 */
export function getCarUser(account: string): CarUsers | null {
  return listedCarUsers.get(account);
}

/**
 * READ function that returns the entire array of registered car owners.
 * @returns CarUsers[]
 */
export function getCarUsers(): CarUsers[] {
  return listedCarUsers.values();
}

/**  This is a WRITE function to rent a car.
 * @param ownerAccount string that requires the name of the account that owns the car to rent.
 */

export function rentACar(ownerAccount: string): void {
  //We require the caller of the function to be a registered user and that the ownerAccount belongs to a car owner.
  assert(
    listedCarUsers.contains(context.sender),
    "You must be a registered user to run this command."
  );
  assert(
    listedCarOwners.contains(ownerAccount),
    "You have to enter a registered owner account to run this command."
  );

  //We store the values of the carUsers and carOwners instantiations. We also store the deposited value.
  const account = listedCarUsers.get(context.sender);
  const carOwner = listedCarOwners.get(ownerAccount);
  const deposit = context.attachedDeposit;

  // We declare the carPrice variable and assign it the price property if carIsAvailable is true.

  var carPrice: u32 = 0;
  if (carOwner) {
    assert(carOwner.carIsAvailable, "The owner's car isn't available.");
    carPrice = carOwner.price;
  }
  //We check if the deposit is equal to the owner's price.
  const priceInt = u128.mul(ONE_NEAR, u128.from(carPrice));
  assert(
    deposit == priceInt,
    "The deposit value must be equal to the owner's price."
  );

  //We transfer to the owner an amount equal to the amount entered by the user when calling the function.
  ContractPromiseBatch.create(ownerAccount).transfer(priceInt);

  //We modify the properties of carOwners and carUsers. In both cases we save that new information.
  if (carOwner && carOwner.carIsAvailable == true) {
    carOwner.carIsAvailable = false;
    listedCarOwners.set(ownerAccount, carOwner);
    logging.log("Auto rentado.El usuario ha rentado el auto al propietario.");
  }
  if (account && account.hasRented == false) {
    account.hasRented = true;
    listedCarUsers.set(context.sender, account);
  }
}

/**  This is a WRITE function to return a rented a car.
 * @param ownerAccount string that requires the name of the account that owns the car to rent.
 */

export function returnCar(ownerAccount: string): void {
  //We require the caller of the function to be a registered user and that the ownerAccount belongs to a car owner.
  assert(
    listedCarUsers.contains(context.sender),
    "You must be a registered user to run this command."
  );
  assert(
    listedCarOwners.contains(ownerAccount),
    "You have to enter a registered owner account to run this command."
  );

  //We store the values of the carUsers and carOwners instantiations. We also store the deposited value.
  const account = listedCarUsers.get(context.sender);
  const carOwner = listedCarOwners.get(ownerAccount);

  //We modify the properties of carOwners and carUsers. In both cases we save that new information.

  if (carOwner && carOwner.carIsAvailable == false) {
    carOwner.carIsAvailable = true;
    listedCarOwners.set(ownerAccount, carOwner);
    logging.log(
      "The user has returned the rented car and now is available again."
    );
  }
  if (account && account.hasRented == true) {
    account.hasRented = false;
    listedCarUsers.set(context.sender, account);
  }
}
