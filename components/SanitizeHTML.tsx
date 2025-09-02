import DOMPurify from 'isomorphic-dompurify';

interface SanitizeHTMLProps {
  html: string;
  className?: string;
}

export const SanitizeHTML = ({ html, className }: SanitizeHTMLProps) => {
  // is-isomorphic-dompurify handles server-side and client-side sanitization
  const sanitizedHtml = DOMPurify.sanitize(html, {
    // Allow style attributes to preserve inline styles for colors, font sizes, etc.
    // This is safe in this context as only trusted admins can create this content.
    ADD_ATTR: ['style'],
  });
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  );
};