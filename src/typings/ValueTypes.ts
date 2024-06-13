export type PersonName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

type Line2Type = 'apartment' | 'floor' | 'suite' | null;

type AddressCommon = {
  line1: string;
  line2: string;
  line2Type: Line2Type;
  city: string;
};

export type AddressUS = AddressCommon & {
  state: string; // @todo - literal
  zipCode: string;
};

export type AddressInternational = AddressCommon & {
  country: string;
  postCode: string;
};
