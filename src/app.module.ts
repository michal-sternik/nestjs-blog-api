import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// useFactory: (config: ConfigService): PostgresConnectionOptions => {
//   const dbConfig = config.get<PostgresConnectionOptions>('database');
//   if (!dbConfig) {
//     throw new Error('Database configuration is wrong!');
//   }
//   return dbConfig;
// },
