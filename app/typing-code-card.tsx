"use client";

import { useState, useEffect } from "react";

const codeLines = [
  "const startButton =",
  "document.querySelector('#start');",
  "",
  "const progress = {",
  "  lesson: 1,",
  "  completed: false,",
  "};",
  "",
  "function startCourse() {",
  "  progress.completed = true;",
  "  startButton.textContent = 'Building..';",
  "}",
];

const tabs = ["index.html", "styles.css", "app.js"];

function highlightLine(line: string) {
  if (!line) return <span>{line}</span>;

  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const tokens = [
    { pattern: /^(const|function|let|var|return|if|else)/, className: "text-[#c792ea]" },
    { pattern: /^(true|false|null|undefined)/, className: "text-[#f78c6c]" },
    { pattern: /^'[^']*'/, className: "text-[#c3e88d]" },
    { pattern: /^"[^"]*"/, className: "text-[#c3e88d]" },
    { pattern: /^\d+/, className: "text-[#f78c6c]" },
    { pattern: /^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*[=({\.])/ , className: "text-[#eeffff]" },
    { pattern: /^[{}();,]/, className: "text-[#eeffff]" },
    { pattern: /^[=]/, className: "text-[#eeffff]" },
    { pattern: /^[a-zA-Z_$][a-zA-Z0-9_$]*/, className: "text-[#eeffff]" },
    { pattern: /^[^a-zA-Z0-9'"{}();,=\s]+/, className: "text-[#eeffff]" },
    { pattern: /^\s+/, className: "" },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const token of tokens) {
      const match = remaining.match(token.pattern);
      if (match) {
        parts.push(<span key={key++} className={token.className}>{match[0]}</span>);
        remaining = remaining.substring(match[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      parts.push(<span key={key++} className="text-[#eeffff]">{remaining[0]}</span>);
      remaining = remaining.substring(1);
    }
  }

  return <>{parts}</>;
}

export function TypingCodeCard() {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("app.js");

  useEffect(() => {
    if (currentLine >= codeLines.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const line = codeLines[currentLine];

    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines.length <= currentLine) {
            newLines.push(line.charAt(0));
          } else {
            newLines[currentLine] = line.substring(0, currentChar + 1);
          }
          return newLines;
        });
        setCurrentChar(prev => prev + 1);
      }, 25 + Math.random() * 35);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <div className="rounded-xl border border-gray-700/50 bg-[#1e1e2e] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50 bg-[#181825]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
            <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
            <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
          </div>
          <div className="ml-4 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${activeTab === tab ? "bg-[#313244] text-[#cdd6f4]" : "text-[#6c7086] hover:text-[#a6adc8]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[200px] overflow-x-auto bg-[#1e1e2e] p-4 font-mono text-sm leading-6 text-[#cdd6f4] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:min-h-[240px] md:p-5">
          {displayedLines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-8 text-[#585b70] text-right mr-4 select-none text-sm">{i + 1}</span>
              <span className="flex-1 whitespace-pre">
                {highlightLine(line)}
                {i === currentLine && (
                  <span className="inline-block w-2 h-5 bg-[#89b4fa] ml-0.5 animate-pulse" />
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-t border-gray-700/50 text-[#585b70] text-xs">
          <span>Ln {Math.min(currentLine + 1, codeLines.length)}, Col {currentChar + 1}</span>
          <span>JavaScript</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
