import DOMPurify from 'isomorphic-dompurify';

interface SanitizeHTMLProps {
  html: string;
  className?: string;
}

export const SanitizeHTML = ({ html, className }: SanitizeHTMLProps) => {
  // is-isomorphic-dompurify handles server-side and client-side sanitization
  const sanitizedHtml = DOMPurify.sanitize(html, {
    // Allow 'style' for colors/sizes and 'class' for font families from Quill.
    // This is safe as only trusted admins create this content, and we control the CSS
    // for the allowed classes (e.g., .ql-font-arial).
    ADD_ATTR: ['style', 'class'],
  });
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  );
};