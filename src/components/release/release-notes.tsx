import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import { cn } from "@/lib/utils";

// Raw HTML in release bodies stays escaped: there is no rehype-raw here on
// purpose, so a release body can never inject markup into the page.
export function ReleaseNotes({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  if (!body.trim()) {
    return (
      <p className="text-sm text-muted-foreground">
        This release was published without notes.
      </p>
    );
  }

  return (
    <div className={cn("release-notes prose max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkGithub, { repository: "vercel/next.js" }],
        ]}
        components={{
          a: ({ href, children }) => (
            <a href={href} rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
