import { Global, Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
})
export class SharedModule {}
