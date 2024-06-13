/* eslint-disable import/prefer-default-export */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
      [K in Keys]-?:
          Required<Pick<T, K>>
          & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

// To be used in places where we need to extend a function for generics
export type BaseFunction = (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

// graphCMS interfaces return Something | null, most controllors do "if (!something) throw new NotFoundError()"
// So the response is guaranteed to not be null.
// This utitily type strips the null from the response.
export type DefinitelyFunctionReturn<F extends BaseFunction> = Exclude<Awaited<ReturnType<F>>, null | undefined>;
export type DefinitelyFunctionReturnPromise<F extends BaseFunction> = Promise<DefinitelyFunctionReturn<F>>;
export type FunctionReturnPromise<F extends BaseFunction> = Promise<Awaited<ReturnType<F>>>;
export type FunctionReturn<F extends BaseFunction> = Awaited<ReturnType<F>>;

export type PaginatedFunctionResponse<I> = { numItems: number, items: Array<I> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyError = any;

export type PropertiesAreNotUndefinedOrNull<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: Exclude<T[P], undefined | null> };
export type PropertiesAreNotUndefined<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: Exclude<T[P], undefined> };
export type NoOptionalProperties<T> = { [P in keyof T]-?: Exclude<T[P], undefined> };
