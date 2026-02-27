"use client";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const markdownToHtml = (markdown: string) => {
    if (!markdown) return "";

    let html = markdown;

    html = html.replace(
      /^###### (.*$)/gim,
      '<h6 class="text-sm font-bold mt-6 mb-2">$1</h6>'
    );
    html = html.replace(
      /^##### (.*$)/gim,
      '<h5 class="text-base font-bold mt-6 mb-2">$1</h5>'
    );
    html = html.replace(
      /^#### (.*$)/gim,
      '<h4 class="text-lg font-bold mt-6 mb-3">$1</h4>'
    );
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>'
    );

    html = html.replace(
      /\*\*(.*?)\*\*/gim,
      '<strong class="font-bold">$1</strong>'
    );
    html = html.replace(
      /__(.*?)__/gim,
      '<strong class="font-bold">$1</strong>'
    );

    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em class="italic">$1</em>');

    html = html.replace(/~~(.*?)~~/gim, '<del class="line-through">$1</del>');

    html = html.replace(/^---$/gim, '<hr class="my-6 border-gray-300" />');
    html = html.replace(/^\*\*\*$/gim, '<hr class="my-6 border-gray-300" />');

    html = html.replace(
      /\n\n(.*?)(?=\n\n|$)/gim,
      '<p class="mb-4 leading-relaxed">$1</p>'
    );

    html = html.replace(/\n/gim, "<br />");

    return html;
  };

  const htmlContent = markdownToHtml(content);

  return (
    <div className="markdown-content text-gray-700 leading-relaxed">
      <div
        className="space-y-4"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <style jsx global>{`
        .markdown-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }

        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }

        .markdown-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }

        .markdown-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }

        .markdown-content ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .markdown-content ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .markdown-content li {
          margin-bottom: 0.5rem;
        }

        .markdown-content code {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
          font-size: 0.875rem;
        }

        .markdown-content pre {
          background-color: #111827;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .markdown-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }

        .markdown-content a {
          color: #2563eb;
          text-decoration: none;
        }

        .markdown-content a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .markdown-content blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
          font-style: italic;
        }

        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .markdown-content hr {
          border: 0;
          border-top: 1px solid #d1d5db;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default MarkdownRenderer;
