type JsonLdProps = {
  data: Record<string, unknown>;
};

// Escape "</script>" so injected JSON-LD can't prematurely close the tag.
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
