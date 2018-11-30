import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from 'nestjs-config';

/**
 * Scalar
 */
import { GraphQLDateTime } from 'graphql-iso-date';

/**
 * Custom Module
 */
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config/**/*.{ts,js}')),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
      installSubscriptionHandlers: true,
      resolvers: { DateTime: GraphQLDateTime },
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.url'),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    UsersModule,
    ImagesModule,
  ],
})
export class AppModule {}
