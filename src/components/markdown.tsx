"use client";

import "katex/dist/katex.min.css";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export function Markdown({ children }: { children: string }) {
	return (
		<div className="prose prose-sm dark:prose-invert max-w-none">
			<ReactMarkdown rehypePlugins={[rehypeKatex]} remarkPlugins={[remarkMath]}>
				{children}
			</ReactMarkdown>
		</div>
	);
}
