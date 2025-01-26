import { Button } from '@/components/ui/button';
import jiraIcon from '@/assets/jira.svg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import Issues from './components/Issues';
import Requirements from './components/About';
import TaskImage from '@/assets/jira/task.svg';
import RequirementsImage from '@/assets/jira/requirements.svg';

export default function App() {
  const [response, setResponse] = useState<any>(null);

  // npm run dev 시에는 주석 처리 해주세요
  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: 'fetchJiraData',
        jql: 'sprint in openSprints() AND issuetype = Task AND assignee = currentUser()',
        githubLink: window.location.href,
      },
      (response) => {
        setResponse(response);
      }
    );
  }, []);

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="flex items-center rounded-md mx-1.5 text-zinc-50 gap-2 h-8 w-full md:w-auto bg-blue-900 hover:bg-blue-800">
          <img src={jiraIcon} className="h-4" alt="jira icon" />
          Open Jira
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white dark:bg-zinc-950 dark:border-zinc-800 border-zinc-200 shadow-lg p-2 m-0">
        <Tabs defaultValue="issues">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="issues">
              <img src={TaskImage} className="mr-1" width={14} height={14} />
              Issues
            </TabsTrigger>
            <TabsTrigger value="requirements">
              <img src={RequirementsImage} className="mr-1" width={14} height={14} />
              Requirements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="issues" forceMount className="data-[state=inactive]:hidden">
            <Issues response={response} />
          </TabsContent>
          <TabsContent value="requirements" className="data-[state=inactive]:hidden">
            <Requirements />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
