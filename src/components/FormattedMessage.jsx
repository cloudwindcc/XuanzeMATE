import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './FormattedMessage.css'

const FormattedMessage = ({ content, role }) => {
  return (
    <div className={`formatted-message ${role}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="markdown-heading" {...props} />,
          h2: ({node, ...props}) => <h2 className="markdown-heading" {...props} />,
          h3: ({node, ...props}) => <h3 className="markdown-heading" {...props} />,
          p: ({node, ...props}) => <p className="markdown-paragraph" {...props} />,
          ul: ({node, ...props}) => <ul className="markdown-list" {...props} />,
          ol: ({node, ...props}) => <ol className="markdown-list" {...props} />,
          li: ({node, ...props}) => <li className="markdown-list-item" {...props} />,
          strong: ({node, ...props}) => <strong className="markdown-strong" {...props} />,
          em: ({node, ...props}) => <em className="markdown-emphasis" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
          code: ({node, inline, ...props}) => 
            inline 
              ? <code className="markdown-code-inline" {...props} />
              : <pre className="markdown-code-block"><code {...props} /></pre>,
          table: ({node, ...props}) => <table className="markdown-table" {...props} />,
          thead: ({node, ...props}) => <thead className="markdown-table-header" {...props} />,
          tbody: ({node, ...props}) => <tbody className="markdown-table-body" {...props} />,
          tr: ({node, ...props}) => <tr className="markdown-table-row" {...props} />,
          th: ({node, ...props}) => <th className="markdown-table-header-cell" {...props} />,
          td: ({node, ...props}) => <td className="markdown-table-cell" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default FormattedMessage