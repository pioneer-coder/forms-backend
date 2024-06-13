export type ReqUser = {
  id: string;
  exp: number;
  isAnonymous: boolean;
  isOnBehalfOf: boolean;
  isComplete?: boolean;
  isCreator: boolean;
  isAdmin?: boolean;
}
