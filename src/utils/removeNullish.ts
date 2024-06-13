const removeNullish = <T>(x: T | undefined | null): x is T => x !== undefined && x !== null;
export default removeNullish;
