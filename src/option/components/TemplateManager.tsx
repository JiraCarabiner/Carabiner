/**
 * 이 컴포넌트는 "Pull Request Templates" 섹션을 관리
 * 사용자에게 템플릿 리스트를 표시하고, 템플릿을 추가/삭제 가능.
 * 수정은 차후에 추가할 예정.
 */
import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { extractPlaceholders } from '@/utils/placeholder';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [defaultTemplateId, setDefaultTemplateId] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // 옵션 페이지 로드 시 기존 템플릿 불러오기
  // 한 번만 실행되어야 하므로 두 번째 인자로 빈 배열을 전달
  // npm run dev 시에는 주석 처리 해주세요
  useEffect(() => {
    chrome.storage.sync.get(['templates', 'defaultTemplateId'], (data) => {
      if (data.templates) setTemplates(data.templates);
      if (data.defaultTemplateId) setDefaultTemplateId(data.defaultTemplateId);
    });
  }, []);

  const handleSetDefaultTemplate = (id: string) => {
    chrome.storage.sync.set({ defaultTemplateId: id }, () => {
      setDefaultTemplateId(id);
    });
  };

  // 템플릿 저장 (전체)
  const saveTemplates = (updated: Template[]) => {
    chrome.storage.sync.set({ templates: updated }, () => {
      setTemplates(updated);
    });
  };

  // 새 템플릿 추가
  const handleAddTemplate = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Title and content are required.');
      return;
    }
    const newTemplate = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent,
    };
    saveTemplates([...templates, newTemplate]);
    setNewTitle('');
    setNewContent('');
  };

  // 템플릿 삭제
  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    saveTemplates(updated);
  };

  return (
    <div className="space-y-4">
      {/* 템플릿 목록 표시 */}
      <div className="space-y-2">
        {templates.length === 0 && <p>No templates found.</p>}
        {templates.map((tpl) => (
          <Card key={tpl.id} className="p-0 relative shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">{tpl.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap overflow-x-auto">{tpl.content}</p>
              {/* 플레이스홀더 미리보기 */}
              <div className="mt-2 text-xs text-gray-600">
                Placeholders: {extractPlaceholders(tpl.content).join(', ') || 'None'}
              </div>
              <Button className="mt-4" variant="outline" onClick={() => handleSetDefaultTemplate(tpl.id)}>
                {defaultTemplateId === tpl.id ? 'Default (Selected)' : 'Set as Default'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleDeleteTemplate(tpl.id)}
                size="icon"
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 새 템플릿 추가 폼 */}
      <div className="p-4 border rounded-xl">
        <Label htmlFor="newTitle">Title</Label>
        <Input
          id="newTitle"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Template Title"
          className="mb-2 mt-2"
        />
        <Label htmlFor="newContent">Content</Label>
        <textarea
          id="newContent"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Use [[{{variables}}]] if you want placeholders..."
          className="w-full rounded border px-2 py-1 text-sm mt-2"
          rows={5}
        />
        <Button onClick={handleAddTemplate} variant="outline" className="mt-4 w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </div>
    </div>
  );
}
