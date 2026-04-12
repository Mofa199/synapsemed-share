"use client"

import React from 'react';
import { CKEditor } from './editor/ckeditor';

interface CKEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CKEditorWrapper({ value, onChange, placeholder }: CKEditorWrapperProps) {
  return (
    <div className="ck-editor-container" style={{ color: "black" }}>
      <CKEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder || 'Type your content here...'}
          height={400}
      />
    </div>
  );
}
