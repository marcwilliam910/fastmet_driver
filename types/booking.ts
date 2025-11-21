export type Booking = {
  _id: string;
  pickUp: {
    name: string;
    address: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
  dropOff: {
    name: string;
    address: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
  bookingType: {
    type: string;
    value: string | null;
  };
  routeData: {
    distance: number;
    duration: number;
    price: number;
  };
  selectedVehicle: {
    id: string;
    name: string;
    capacity: string;
  };
  addedServices: Services[];
  paymentMethod: string;
  note: string;
  images: string[];
};

export type Services = {
  id: string;
  name: string;
  price: number;
  icon: string;
};
