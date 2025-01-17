import { Button } from './ui/button';
import jiraIcon from '@/assets/jira.svg';

export default function JiraButton() {
  return (
    <Button className="flex items-center rounded-md mx-1.5 gap-2 h-8 w-full md:w-auto bg-blue-900 hover:bg-blue-800">
      <img src={jiraIcon} className="h-4" alt="jira icon" />
      Open Jira
    </Button>
  );
}
