import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { hashSync } from 'bcrypt'
import * as request from 'supertest'
import { getConnection, getRepository } from 'typeorm'
import { AuthModule } from './auth.module'
import { User } from '../../entities/user.entity'
import { AppModule } from '../app.module'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { IUser } from '../../interfaces/user.interface'
import { GetRefreshTokenDto } from './dto/get-refresh-token.dto'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let jwt: string
  let user: IUser

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    // Validation Pipe
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    // DB interaction
    const usersRepo = await getRepository(User)
    let initialUser = usersRepo.create({
      profile_image: 'undefined',
      email: 'test@gmail.com',
      first_name: 'Test',
      last_name: 'User',
      password: hashSync('Test123!', 10)
    })
    initialUser = await usersRepo.save(initialUser)
    user = initialUser
  })

  afterAll(async () => {
    try {
      const entities = []
      getConnection().entityMetadatas.forEach((x) =>
        entities.push({ name: x.name, tableName: x.tableName })
      )

      for (const entity of entities) {
        const repository = getRepository(entity.name)
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" cascade;`)
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`)
    }

    const conn = getConnection()
    return conn.close()
  })

  it('/auth/register (POST) --> 400 on validation error', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('/auth/register (POST)', async () => {
    const dto: CreateUserDto = {
      profile_image: 'undefined',
      email: 'mockuser@gmail.com',
      first_name: 'Mock',
      last_name: 'User',
      password: 'Mock123!',
      confirm_password: 'Mock123!'
    }
    await request(app.getHttpServer())
      .post('/auth/register')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          user: {
            id: expect.any(Number),
            email: 'mockuser@gmail.com',
            first_name: 'Mock',
            last_name: 'User',
            profile_image: 'undefined'
          },
          access_token: expect.any(String)
        })
      })
  })

  it('/auth/login (POST)', async () => {
    const dto: LoginUserDto = {
      username: 'mockuser@gmail.com',
      password: 'Mock123!'
    }
    await request(app.getHttpServer())
      .post('/auth/login')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then((res) => {
        jwt = res.body.access_token
        expect(res.body).toEqual({
          user: {
            id: expect.any(Number),
            email: 'mockuser@gmail.com',
            first_name: 'Mock',
            last_name: 'User',
            profile_image: 'undefined'
          },
          access_token: expect.any(String)
        })
        jwt = res.body.access_token
      })
  })

  it('/auth/refresh-token (POST)', async () => {
    const dto: GetRefreshTokenDto = {
      name: user.email,
      sub: user.id
    }
    await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          access_token: expect.any(String)
        })
      })
  })

  it('/auth/protected (GET)', async () => {
    await request(app.getHttpServer())
      .get('/auth/protected')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
  })
})
