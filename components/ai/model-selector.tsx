'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CHAT_MODELS } from '@/lib/ai-config';

interface AIModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  whitelist?: string[];
  blacklist?: string[];
  placeholder?: string;
}

export function AIModelSelector({
  value,
  onValueChange,
  className,
  whitelist,
  blacklist,
  placeholder = "Select AI Model",
}: AIModelSelectorProps) {
  const allModels = Object.values(CHAT_MODELS);
  
  const filteredModels = allModels.filter((model) => {
    if (whitelist && !whitelist.includes(model.id)) return false;
    if (blacklist && blacklist.includes(model.id)) return false;
    return true;
  });

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredModels.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name} ({model.credits} Cr)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
