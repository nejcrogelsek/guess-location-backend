import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { hashSync } from 'bcrypt'
import * as request from 'supertest'
import { getConnection, getRepository } from 'typeorm'
import { UsersModule } from './users.module'
import { User } from '../../entities/user.entity'
import { AppModule } from '../app.module'
import { UpdateUserDto } from './dto/update-user.dto'
import { IUser } from '../../interfaces/user.interface'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let user: IUser

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule]
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

  it('/users (GET)', async () => {
    await request(app.getHttpServer()).get('/users').expect(200)
  })

  it('/users/me/update (PATCH)', async () => {
    const dto: UpdateUserDto = {
      id: user.id,
      first_name: 'Neki',
      last_name: 'Uporabnik',
      password: 'Neki123!',
      profile_image: 'undefined'
    }
    await request(app.getHttpServer())
      .patch('/users/me/update')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          id: user.id,
          email: user.email,
          first_name: 'Neki',
          last_name: 'Uporabnik',
          profile_image: expect.any(String),
          email_token: null,
          confirmed: false,
          password: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
      })
  })

  it('/users/upload (GET)', async () => {
    await request(app.getHttpServer())
      .get('/users/upload')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          url: expect.any(String)
        })
      })
  })

  it('/users/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          email: user.email,
          first_name: 'Neki',
          last_name: 'Uporabnik',
          profile_image: expect.any(String),
          password: expect.any(String),
          email_token: null,
          confirmed: false,
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
      })
  })
})
