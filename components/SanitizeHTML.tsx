import DOMPurify from 'isomorphic-dompurify';

interface SanitizeHTMLProps {
  html: string;
  className?: string;
}

export const SanitizeHTML = ({ html, className }: SanitizeHTMLProps) => {
  // is-isomorphic-dompurify handles server-side and client-side sanitization
  const sanitizedHtml = DOMPurify.sanitize(html);
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  );
};