// @todo - DRY up
import { SlateAST } from '@/utils/slate/index.js';

export type Scalars = {
  DateTime: Date; // Date on BE, string on FE
};

export type Assignee = {
  id: string;
  name: string | null;
  primaryColour: { hex: string } | null;
  image: { url: string } | null;
};

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

export type FieldTemplate = {
  descriptionAST: SlateAST | null;
  descriptionHtml: string | null;
  descriptionText: string | null;
  id: string;
  isRequired: boolean;
  key: string;
  label: string;
  options: Record<string, unknown>; // @todo - can this by typed based on the type?
  rank: number;
  questionnaireId: string;
  sectionTemplateId: string;
  type: FieldType;
  validation: Validation | null; // @todo - can this by typed based on the type?
  assignees: Array<Assignee>;
};

export type QuestionnaireResponse = {
  id: string;
  fieldTemplate: Pick<FieldTemplate,
    | 'assignees'
    | 'descriptionHtml'
    | 'id'
    | 'isRequired'
    | 'key'
    | 'label'
    | 'options'
    | 'rank'
    | 'sectionTemplateId'
    | 'type'
    | 'questionnaireId'
    | 'validation'
  >;
  value: unknown | null; // @todo - type based on fieldTemplate.type (does it need to be pulled up?)
}
