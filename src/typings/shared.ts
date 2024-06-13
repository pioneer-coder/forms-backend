// @todo figure out how to DRY up with FE versions

import * as ValueTypes from './ValueTypes.js';

export type FieldType =
  | 'short-text'
  | 'long-text'
  | 'numeric' // short text with filter?
  | 'number'
  | 'multi-select'
  | 'single-select'
  | 'selection'
  | 'percent'
  | 'currency'
  | 'date'
  | 'phone-number'
  /* composite fields */
  | 'name'
  | 'address-us'
  | 'address-international'
  | 'list'
  /* for organizing */
  | 'break'
  | 'explanation';

type CustomValidators = {
  age?: {
    limit: number;
    symbol: '>=' | '>' | '=' | '<' | '<=';
    message: string;
  }
};

type NativeValidators = {
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  type?: {
    value: 'email' | 'number';
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  }
};

export type Validation = CustomValidators & NativeValidators;

export type FieldCommon = {
  id: string;
  key: string;
  rank: number;
  label: string;
  description: string;
  type: FieldType;
  isRequired: boolean;
  assignedTo: string[];
  validation?: Validation;
};

type FieldShortText = FieldCommon & {
  type: 'short-text';
  mask?: string; // eg XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX for UUID
  validation?: Pick<
    Validation,
    'minLength' | 'maxLength' | 'type' | 'pattern'
  >;
};

type FieldPercent = FieldCommon & {
  type: 'percent';
  validation?: Pick<Validation, 'min' | 'max'>;
};

type FieldCurrency = FieldCommon & {
  type: 'currency';
  validation?: Pick<Validation, 'min' | 'max'>;
};

type FieldLongText = FieldCommon & {
  type: 'long-text';
  validation?: Pick<
    Validation,
    'minLength' | 'maxLength' | 'type' | 'pattern'
  >;
};

// or short text with a filter function?
type FieldNumeric = FieldCommon & {
  type: 'numeric';
  mask?: string; // eg ###-##-#### for SSN
  validation?: Pick<Validation, 'minLength' | 'maxLength' | 'pattern'>;
};

type FieldNumber = FieldCommon & {
  type: 'integer';
  suffix?: string; // eg '%' for percentage
  prefix?: string; // eg '$' for dollars/currency
  significantDigits?: number; // eg 0 for integer
  validation?: Pick<Validation, 'min' | 'max'>;
};

type FieldMultiSelect<V = string> = FieldCommon & {
  type: 'multi-select';
  style: 'checkbox' | 'radio-button' | 'button';
  options: Array<{
    key: V;
    label: string;
  }>;
};

type FieldSingleSelect<V = string> = FieldCommon & {
  type: 'single-select';
  style: 'checkbox' | 'radio-button' | 'button';
  options: Array<{
    key: V;
    label: string;
  }>;
};

type FieldSelection<V = string> = FieldCommon & {
  type: 'selection';
  options: Array<{
    key: V;
    label: string;
  }>;
};

type FieldDate = FieldCommon & {
  type: 'date';
  validation?: Pick<Validation, 'age'>;
};

type FieldName = FieldCommon & {
  type: 'name';
};

type FieldAddressUS = FieldCommon & {
  type: 'address-us';
};

type FieldAddressInternational = FieldCommon & {
  type: 'address-international';
};

type FieldPhoneNumber = FieldCommon & {
  type: 'phone-number';
};

type FieldBreak = {
  type: 'break';
  value?: never;
};

type FieldExplanation = {
  type: 'explanation';
  text: string;
  value?: never;
  /* does this need to be rich?
  html: string;
  raw: Slate;
  */
};

export type FieldList = FieldCommon & {
  min: number;
  max: number;
  fields: Field[]; // eslint-disable-line no-use-before-define
};

export type Field =
  | FieldShortText
  | FieldLongText
  | FieldNumeric
  | FieldNumber
  | FieldPercent
  | FieldCurrency
  | FieldMultiSelect
  | FieldSingleSelect
  | FieldSelection
  | FieldName
  | FieldDate
  | FieldAddressUS
  | FieldAddressInternational
  | FieldPhoneNumber
  | FieldBreak
  | FieldExplanation
  | FieldList;

type Section = {
  id: string;
  slug: string;
  label: string;
  description: string;
  fields: Field[];
};

export type Questionnaire = {
  id: string;
  slug: string;
  label: string;
  description: string;
  version: number;
  sections: Section[];
};

type ResponseCommon = {
  id: string;
  fieldTemplate: Field;
}

type ResponseShortText = ResponseCommon & {
  type: 'short-text';
  value: string | null;
};

type ResponseLongText = ResponseCommon & {
  type: 'long-text';
  value: string | null;
};

type ResponseNumeric = ResponseCommon & {
  type: 'numeric';
  value: string | null;
}

type ResponseNumber = ResponseCommon & {
  type: 'number';
  value: number | null;
}

type ResponseMultiSelect<V = string> = ResponseCommon & {
  type: 'multi-select';
  value: V[];
}

type ResponseSingleSelect <V = string>= ResponseCommon & {
  type: 'single-select';
  value: V | null;
}

type ResponseSelection<V = string> = ResponseCommon & {
  type: 'selection';
  value: V | null;
}

type ResponsePercent = ResponseCommon & {
  type: 'percent';
  value: number | null;
}

type ResponseCurrency = ResponseCommon & {
  type: 'currency';
  value: {
    amount: number;
    currency: string; // @todo - currency type
  } | null;
}

type ResponseDate = ResponseCommon & {
  type: 'date';
  value: string | null; // YYYY-MM-DD
}

type ResponsePhoneNumber = ResponseCommon & {
  type: 'phone-number';
  value: string | null; // +{cc}{nationalnumber}
  // value: {
  //   countryCode: string;
  //   nationalNumber: string;
  // }
}

type ResponsePersonName = ResponseCommon & {
  type: 'name';
  value: ValueTypes.PersonName;
}

type ResponseAddressUS = ResponseCommon & {
  type: 'address-us';
  value: ValueTypes.AddressUS | null;
}

type ResponseAddressInternational = ResponseCommon & {
  type: 'address-international';
  value: ValueTypes.AddressInternational | null;
}

type ResponseList = ResponseCommon & {
  type: 'list';
  value: FieldResponse[]; // eslint-disable-line no-use-before-define
}

export type FieldResponse =
  | ResponseShortText
  | ResponseLongText
  | ResponseNumeric
  | ResponseNumber
  | ResponseMultiSelect
  | ResponseSingleSelect
  | ResponseSelection
  | ResponsePercent
  | ResponseCurrency
  | ResponseDate
  | ResponsePhoneNumber
  | ResponsePersonName
  | ResponseAddressUS
  | ResponseAddressInternational
  | ResponseList;
