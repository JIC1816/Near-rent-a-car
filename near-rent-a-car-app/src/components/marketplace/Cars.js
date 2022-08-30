import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddCar from "./AddCar.js";
import Car from "./Car";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getCarOwner,
  getCarOwners,
  createCarOwner,
  createCarUser,
  getCarUser,
  getCarUsers,
  rentACar,
  returnCar,
} from "../../utils/marketplace";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCars = useCallback(async () => {
    try {
      setLoading(true);
      setCars(await getCarOwners());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setUsers(await getCarUsers());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addCarOwner = async (data) => {
    try {
      setLoading(true);
      createCarOwner(data).then((resp) => {
        getCars();
      });
      toast(<NotificationSuccess text="Car Owner added successfully!" />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a car Owner" />);
    } finally {
      setLoading(false);
    }
  };

  const addCarUser = async (data) => {
    try {
      setLoading(true);
      createCarUser(data).then((resp) => {
        getUsers();
      });
      toast(<NotificationSuccess text="Car User added successfully!" />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a car User" />);
    } finally {
      setLoading(false);
    }
  };

  const rent = async (ownerAccount, price) => {
    try {
      await rentACar({
        ownerAccount,
        price,
      }).then((resp) => getCars());
      toast(<NotificationSuccess text="Car successfully rented." />);
    } catch (error) {
      toast(<NotificationError text="Failed to rent the car." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Rent a Car</h1>
            <AddCar save={addCarOwner} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {cars.map((_car) => (
              <Car
                car={{
                  ..._car,
                }}
                rent={rent}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Cars;
