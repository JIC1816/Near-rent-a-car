import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";

const Car = ({ car, rent }) => {
  const { id, account, name, description, carIsAvailable, price } = car;

  const triggerRent = () => {
    rent(account, price);
  };

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{account}</span>
            <Badge bg="secondary" className="ms-auto">
              {carIsAvailable ? "Available" : "Rented"}
            </Badge>
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <Button
            variant="outline-dark"
            onClick={triggerRent}
            className="w-100 py-3"
          >
            Rent for {price} NEAR
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

Car.propTypes = {
  car: PropTypes.instanceOf(Object).isRequired,
  rent: PropTypes.func.isRequired,
};

export default Car;
