type RichTextHtml = { html: string } | null;

const asRichTextHtml = (text: { html: string | null } | null | undefined): RichTextHtml => (text?.html ? { html: text.html } : null);

export default asRichTextHtml;
