//import { parseNearAmount } from "near-api-js/lib/utils/format";
import { v4 as uuid4 } from "uuid";

const GAS = 100000000000000;

export function createCarOwner(carOwner) {
  //let carPrice = parseNearAmount(price + "");
  carOwner.id = uuid4();
  return window.contract.setCarOwner({ carOwner }, carOwner.price, GAS);
}

export function getCarOwner({ account }) {
  return window.contract.getCarOwner({ account });
}

export function getCarOwners() {
  return window.contract.getCarOwners();
}

export function createCarUser(carUser) {
  carUser.id = uuid4();
  return window.contract.setCarUser({ carUser });
}

export function getCarUser({ account }) {
  return window.contract.getCarUser({ account });
}

export function getCarUsers() {
  return window.contract.getCarUsers();
}

export function rentACar({ ownerAccount }) {
  return window.contract.rentACar({ ownerAccount });
}

export function returnCar({ ownerAccount }) {
  return window.contract.returnCar({ ownerAccount }, GAS);
}
