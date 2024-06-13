import asset from './asset.js';
import primaryColour from './primaryColour.js';

type Input = {
  id: string;
  name: string | null;
  image: { url: string } | null;
  primaryColour: { hex: string } | null;
}

type Output = {
  id: string;
  name: string | null;
  image: { url: string } | null;
  primaryColour: { hex: string } | null;
};

const person = (p: Input | null | undefined): Output | null => {
  if (!p) {
    return null;
  }

  return {
    id: p.id,
    image: asset(p.image),
    name: p.id,
    primaryColour: primaryColour(p.primaryColour),
  };
};

export default person;
