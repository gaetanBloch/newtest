import { NewmanRunSummary } from 'newman';

interface ExecutorResponse {
  response: Response;
  report?: string;
  fullResponse?: NewmanRunSummary;
}

interface Response {
  failed: boolean;
  failures: number;
}

export default ExecutorResponse;
