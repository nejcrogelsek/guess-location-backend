import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { hashSync } from 'bcrypt'
import * as request from 'supertest'
import { getConnection, getRepository } from 'typeorm'
import { AppModule } from '../app.module'
import { User } from '../../entities/user.entity'
import { Place } from '../../entities/place.entity'
import { PlacesModule } from './places.module'
import { UsersModule } from '../users/users.module'
import { CreateLocationDto } from './dto/create-location.dto'
import { CreateGuessDto } from './dto/create-guess.dto'
import { LoginUserDto } from '../auth/dto/login-user.dto'

describe('PlacesController (e2e)', () => {
  let app: INestApplication
  let location: Place
  let user: User
  let jwt: string
  let guessId: number

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PlacesModule, UsersModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    // Validation Pipe
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    // DB interaction
    const usersRepo = getRepository(User)
    let initialUser = usersRepo.create({
      profile_image: 'undefined',
      email: 'test@gmail.com',
      first_name: 'Test',
      last_name: 'User',
      password: hashSync('Test123!', 10),
	  confirmed: true
    })
    initialUser = await usersRepo.save(initialUser)
    user = initialUser
    const placesRepo = getRepository(Place)
    const initialLocation = await placesRepo.save({
      user_id: user.id,
      lat: '46.51028',
      long: '15.08056',
      city: 'Slovenj Gradec',
      location_image: 'undefined'
    })
    location = initialLocation
  })

  afterAll(async () => {
    try {
      const entities = []
      await (
        await getConnection()
      ).entityMetadatas.forEach((x) =>
        entities.push({ name: x.name, tableName: x.tableName })
      )

      for (const entity of entities) {
        const repository = await getRepository(entity.name)
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" cascade;`)
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`)
    }

    const conn = getConnection()
    return conn.close()
  })

  it('/auth/login (POST)', async () => {
    const dto: LoginUserDto = {
      username: user.email,
      password: 'Test123!'
    }
    await request(app.getHttpServer())
      .post('/auth/login')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          user: {
            id: expect.any(Number),
            email: 'test@gmail.com',
            first_name: 'Test',
            last_name: 'User',
            profile_image: 'undefined',
            confirmed: true
          },
          access_token: expect.any(String)
        })
        jwt = res.body.access_token
      })
  })

  it('/location/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/location/${user.id}`)
	  .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('/location/best/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/location/best/${user.id}`)
	  .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('/location/random (GET)', async () => {
    await request(app.getHttpServer())
      .get('/location/random')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('/location (POST)', async () => {
    const dto: CreateLocationDto = {
      lat: '46.51028',
      long: '15.08056',
      address: 'Ljubljana',
      location_image: 'undefined'
    }
    await request(app.getHttpServer())
      .post('/location')
	  .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
	  .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          lat: '46.51028',
          long: '15.08056',
          city: 'Ljubljana',
          location_image: 'undefined',
          user_id: user.id,
          id: expect.any(Number),
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
      })
  })

  it('/location/guesses (GET)', async () => {
    await request(app.getHttpServer())
      .get('/location/guesses')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('/location/:id/user/:user_id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/location/${location.id}/user/${user.id}`)
	  .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
  })

  it('/location/guess/:id (POST)', async () => {
    const dto: CreateGuessDto = {
      location_id: location.id,
      distance: 1000,
      address: 'Unknown location'
    }

    await request(app.getHttpServer())
      .post(`/location/guess/${location.id}`)
	  .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
	  .send(dto) 
	  .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          location_id: location.id,
          user_id: user.id,
          distance: 1000,
          address: 'Unknown location',
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
        guessId = res.body.id
      })
  })

  it('/location/guess/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/location/guess/${guessId}`)
	  .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          location_id: location.id,
          user_id: user.id,
          distance: 1000,
          address: 'Unknown location',
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
      })
  })

  it('/location/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/location/${location.id}`)
	  .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          lat: 46.51028,
          long: 15.08056,
          city: 'Slovenj Gradec',
          location_image: 'undefined',
          user_id: user.id,
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
      })
  })
})
