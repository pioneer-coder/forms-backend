type DefaultO = Record<string, unknown>;

const getTypedKeys = <O extends DefaultO = DefaultO>(o: O): Array<keyof O> => Object.keys(o);

export default getTypedKeys;
