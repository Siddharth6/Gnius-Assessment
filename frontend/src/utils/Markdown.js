import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {InlineMath, BlockMath} from 'react-katex';
import math from 'remark-math';
import 'katex/dist/katex.min.css';

const renderers = {
  inlineMath: ({value}) => <InlineMath math={value} />,
  math: ({value}) => <BlockMath math={value} />,
  code: ({language, value}) => {
    return <SyntaxHighlighter language={language} children={value} />
  }
};

const Markdown = (props) => {
  return (
    <ReactMarkdown renderers={renderers} plugins={[gfm,math]} {...props} />
  )
};

export default Markdown;