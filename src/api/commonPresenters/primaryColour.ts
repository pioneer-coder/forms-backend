const primaryColour = (i: string | { hex: string } | null | undefined): { hex: string } | null => {
  if (!i) {
    return null;
  }

  if (typeof i === 'string') {
    return { hex: i };
  }

  return i.hex ? { hex: i.hex } : null;
};

export default primaryColour;
