import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { CheckSquare2, Square } from 'lucide-react';

interface Issue {
  key: string;
  fields: {
    summary: string;
    assignee: {
      displayName: string;
      avatarUrls: {
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

interface Props {
  response: {
    issues: Issue[];
  } | null;
}

type STATUS = true | false;

export default function Issues({ response }: Props) {
  const [checkedIssues, setCheckedIssues] = useState<STATUS[]>(
    response?.issues ? new Array(response.issues.length).fill(false) : []
  );

  if (!response) {
    return <div className="text-center py-4">Loading issues...</div>;
  }

  const issues = response.issues;

  if (issues.length === 0) {
    return <div className="text-center py-4">No issues found.</div>;
  }

  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <Card
            key={issue.key}
            className="w-full"
            onClick={() => {
              setCheckedIssues((prev) => {
                const temp = [...prev];
                temp[index] = !temp[index];
                return temp;
              });
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{issue.key}</CardTitle>
              <Badge
                variant="outline"
                className={`bg-${getBadgeColor(issue.fields.status.statusCategory.colorName)}-100 text-${getBadgeColor(issue.fields.status.statusCategory.colorName)}-800`}
              >
                {issue.fields.status.name}
              </Badge>
            </CardHeader>
            <CardContent>
              {checkedIssues[index] === true ? <CheckSquare2 /> : <Square />}
              <p className="text-sm mb-4">{issue.fields.summary}</p>
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={issue.fields.assignee.avatarUrls['48x48']}
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
      return 'blue';
    case 'yellow':
      return 'yellow';
    case 'green':
      return 'green';
    default:
      return 'gray';
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
