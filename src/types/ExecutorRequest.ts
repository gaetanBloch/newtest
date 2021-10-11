import { ApiProperty } from '@nestjs/swagger';

class ExecutorRequest {
  @ApiProperty({
    description: 'Collection string content',
  })
  collection: string;
  @ApiProperty({
    description: 'Environment variables string content',
  })
  environment: string;
}

export default ExecutorRequest;
