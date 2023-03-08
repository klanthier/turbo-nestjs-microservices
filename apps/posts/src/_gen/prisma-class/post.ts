import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiPropertyOptional({ type: String })
  content?: string;

  @ApiProperty({ type: Boolean })
  published: boolean;
}
