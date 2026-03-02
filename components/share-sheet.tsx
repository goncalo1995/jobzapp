'use client';

import { useState } from 'react';
import { Share2, X, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

interface ShareSheetProps {
  title: string;
  text: string;
  url: string;
}

export function ShareSheet({ title, text, url }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: <X className="h-3 w-3" />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-3 w-3" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
  ];

  return (
    <div className="flex items-center gap-1">
      <button 
        onClick={handleCopy}
        className="p-2 hover:bg-white/5 rounded-none border border-white/5 transition-all text-[#F5F0E8]/40 hover:text-[#FF8C00] hover:border-[#FF8C00]/30"
        title="Copy Link"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <LinkIcon className="h-3.5 w-3.5" />}
      </button>
      
      {shareLinks.map(link => (
        <a 
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-white/5 rounded-none border border-white/5 transition-all text-[#F5F0E8]/40 hover:text-[#FF8C00] hover:border-[#FF8C00]/30"
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
