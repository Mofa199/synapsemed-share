"use client"

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Autoformat,
    Bold,
    Italic,
    BlockQuote,
    Heading,
    Link,
    List,
    Paragraph,
    Table,
    TableToolbar,
    Undo,
    Font,
    Alignment,
    SourceEditing,
    Image,
    ImageUpload,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

interface CKEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CKEditorWrapper({ value, onChange, placeholder }: CKEditorWrapperProps) {
  return (
    <div className="ck-editor-container" style={{ color: "black" }}>
      <CKEditor
          editor={ ClassicEditor }
          config={ {
              plugins: [
                  Essentials, Autoformat, Bold, Italic, BlockQuote, 
                  Heading, Link, List, Paragraph, Table, TableToolbar, 
                  Undo, Font, Alignment, SourceEditing,
                  Image, ImageUpload, ImageToolbar, ImageCaption, ImageStyle, ImageResize
              ],
              toolbar: [
                  'undo', 'redo', '|',
                  'heading', '|',
                  'bold', 'italic', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                  'alignment', 'bulletedList', 'numberedList', '|',
                  'link', 'insertImage', 'insertTable', 'blockQuote', '|',
                  'sourceEditing'
              ],
              image: {
                  toolbar: [
                      'imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline',
                      'imageStyle:block', 'imageStyle:side'
                  ]
              },
              table: {
                  contentToolbar: [
                      'tableColumn', 'tableRow', 'mergeTableCells'
                  ]
              },
              placeholder: placeholder || 'Type your content here...'
          } }
          data={value}
          onChange={ ( event, editor ) => {
              const data = editor.getData();
              onChange(data);
          } }
      />
    </div>
  );
}
