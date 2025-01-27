import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

const scrollbarStyles = `
  .scrollbar-custom::-webkit-scrollbar {
    width: 10px;
  }
  .scrollbar-custom::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scrollbar-custom::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
  .scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

interface Issue {
  key: string;
  fields: {
    summary: string;
    assignee: {
      displayName: string;
      avatarUrls: {
        '16x16': string;
        '24x24': string;
        '32x32': string;
        '48x48': string;
      };
    };
    status: {
      name: string;
      statusCategory: {
        colorName: string;
      };
    };
  };
}

type STATUS = true | false;

interface Props {
  response: {
    issues: Issue[];
  } | null;
  selectedIssues: boolean[]; // 추가
  setSelectedIssues: React.Dispatch<React.SetStateAction<boolean[]>>; // 추가
}

export default function Issues({ response, selectedIssues, setSelectedIssues }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!response) {
    return <div className="text-center py-4">Loading issues...</div>;
  }

  const issues = response.issues;

  if (issues.length === 0) {
    return <div className="text-center py-4">No issues found.</div>;
  }

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      return (
        searchTerm === '' ||
        issue.fields.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, issues]);

  return (
    <ScrollArea className="flex items-center justify-items w-full h-[400px] p-0 scrollbar-custom">
      <div className="mb-2 flex relative m-0 p-0 py-0 pl-2 pr-3">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={`검색`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={false}
          className="bg-zinc-50 rounded-xl border border-zinc-300 w-full text-md h-9 pl-12 pr-4 placeholder-gray-400 font-medium py-0 outline-none focus:ring-0 focus:border-zinc-300 focus:bg-slate-50 transition-all duration-200"
        />
      </div>
      <style>{scrollbarStyles}</style>
      <div className="space-y-4 pl-2 pt-1 pr-3">
        {filteredIssues.map((issue, index) => (
          <Card
            key={issue.key}
            className={`w-full transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
                        ${
                          selectedIssues[index] ? 'bg-primary/10 border-primary' : 'hover:shadow-md hover:scale-[1.02]'
                        }`}
            onClick={() => {
              setSelectedIssues((prev) => {
                const temp = [...prev];
                temp[index] = !temp[index];
                return temp;
              });
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 px-4 pb-0">
              <CardTitle className="text-xs font-medium">
                <a href={`https://hansung-team-xo7vjnbwqvx0.atlassian.net/browse/${issue.key}`}>{issue.key}</a>
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-xs ${getBadgeColor(issue.fields.status.statusCategory.colorName)}`}
              >
                {issue.fields.status.name}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col p-2 px-4">
              <div className="flex space-x-2 items-start">
                <div
                  className={`w-4 h-4 mt-1 rounded-full transition-all duration-300 ease-in-out
                                 ${selectedIssues[index] ? 'bg-primary scale-110' : 'border-2 border-gray-300'}`}
                />
                <p className="text-sm mb-4">{issue.fields.summary}</p>
              </div>
              <div className="flex items-center">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={issue.fields.assignee.avatarUrls['16x16']}
                    alt={issue.fields.assignee.displayName}
                  />
                  <AvatarFallback>{getInitials(issue.fields.assignee.displayName)}</AvatarFallback>
                </Avatar>
                <span className="text-sm ml-2">{issue.fields.assignee.displayName}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeColor(colorName: string): string {
  switch (colorName) {
    case 'blue-gray':
      return 'bg-blue-50 text-blue-600';
    case 'yellow':
      return 'bg-yellow-50 text-yellow-600';
    case 'green':
      return 'bg-green-50 text-green-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
