import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './app.module'

describe('AppController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should return string', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect('This is NestJS API for project Geotagger.')
      .expect(200)
  })
})
