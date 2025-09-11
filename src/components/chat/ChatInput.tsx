import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Square,
  Loader2 
} from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder = "Ask me anything about Excel..." 
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    console.log('File upload clicked');
  };

  const toggleRecording = () => {
    // TODO: Implement voice recording functionality
    setIsRecording(!isRecording);
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t bg-white dark:bg-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2">
            {/* File Upload Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mb-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleFileUpload}
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-12 text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
              
              {/* Character count (optional) */}
              {value.length > 0 && (
                <div className="absolute bottom-1 right-14 text-xs text-gray-400">
                  {value.length}
                </div>
              )}
            </div>

            {/* Voice Recording Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`mb-2 ${
                isRecording 
                  ? 'text-red-600 hover:text-red-700' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={toggleRecording}
              disabled={disabled}
            >
              {isRecording ? (
                <Square className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              size="sm"
              className="mb-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canSend}
            >
              {disabled ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Helper Text */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {isRecording && (
                <span className="flex items-center gap-1 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  Recording...
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>Excel Pilot v0.0.7</span>
            </div>
          </div>
        </form>

        {/* Quick Actions (Optional) */}
        <div className="mt-3 flex flex-wrap gap-2">
          <QuickActionButton 
            text="Building rules" 
            onClick={() => onChange("What are the building rules?")}
            disabled={disabled}
          />
          <QuickActionButton 
            text="Building contacts" 
            onClick={() => onChange("What are the building contacts?")}
            disabled={disabled}
          />
          <QuickActionButton 
            text="Lift reservation policy" 
            onClick={() => onChange("How does the lift reservation policy works?")}
            disabled={disabled}
          />
          <QuickActionButton 
            text="Visitor's car park" 
            onClick={() => onChange("What are the rules for visitor's car park?")}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function QuickActionButton({ text, onClick, disabled = false }: QuickActionButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs h-7 px-3 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
