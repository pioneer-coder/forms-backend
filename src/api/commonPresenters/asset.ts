const asset = (thing: { url: string; } | null | undefined): { url: string } | null => (thing?.url
  ? { url: thing.url }
  : null
);

export default asset;
