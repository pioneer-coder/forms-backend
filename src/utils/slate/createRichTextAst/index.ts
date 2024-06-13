type RichTextAst = {
  children: Array<{
    children: Array<{ text: string }>,
    type: 'paragraph',
  }>
};

const createRichTextAst = (...paragraphs: string[]): RichTextAst => ({
  children: paragraphs.map((text) => ({
    children: [
      {
        text,
      },
    ],
    type: 'paragraph',
  })),
});

export default createRichTextAst;
