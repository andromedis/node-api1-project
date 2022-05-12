import request, { Response } from 'supertest';
import { server } from './api/server';
import * as UserModel from  './api/users/model';
import { BaseUser, User } from './api/users/user.interface';

it('sanity check', () => {
  expect(true).not.toBe(false)
})

const initialUsers: BaseUser[] = [
  { name: 'Ed Carter', bio: 'hero' },
  { name: 'Mary Edwards', bio: 'super hero' },
]

beforeEach(() => {
  UserModel.resetDB()
})

describe('server.js', () => {
  // 👉 USERS
  // 👉 USERS
  // 👉 USERS
  describe('user endpoints', () => {
    describe('[POST] /api/users', () => {
      it('responds with a new user', async () => {
        const newUser: BaseUser = { name: 'foo', bio: 'bar' }
        const res: Response = await request(server).post('/api/users').send(newUser)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toMatchObject(newUser)
      }, 500)
      it('adds a new user to the db', async () => {
        const newUser: BaseUser = { name: 'fizz', bio: 'buzz' }
        await request(server).post('/api/users').send(newUser)
        const users: User[] = await UserModel.find()
        expect(users[0]).toMatchObject(initialUsers[0])
        expect(users[1]).toMatchObject(initialUsers[1])
        expect(users[2]).toMatchObject(newUser)
      }, 500)
      it('responds with the correct status code on success', async () => {
        const newUser: BaseUser = { name: 'fizz', bio: 'buzz' }
        const res: Response = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(201)
      }, 500)
      it('responds with the correct message & status code on validation problem', async () => {
        let newUser: { [key: string]: any } = { name: 'only name' }
        let res: Response = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/provide name and bio/)
        newUser = { bio: 'only bio' }
        res = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/provide name and bio/)
        newUser = {}
        res = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/provide name and bio/)
      }, 500)
    })
    describe('[GET] /api/users', () => {
      it('can get all the users', async () => {
        const res: Response = await request(server).get('/api/users')
        expect(res.body).toHaveLength(initialUsers.length)
      }, 500)

      it('can get the correct users', async () => {
        const res: Response = await request(server).get('/api/users')
        expect(res.body[0]).toMatchObject(initialUsers[0])
        expect(res.body[1]).toMatchObject(initialUsers[1])
      }, 500)
    })
    describe('[GET] /api/users/:id', () => {
      it('responds with the correct user', async () => {
        let [{ id }] = await UserModel.find()
        let res: Response = await request(server).get(`/api/users/${id}`)
        expect(res.body).toMatchObject(initialUsers[0]);

        let [_, { id: newId }] = await UserModel.find() // eslint-disable-line
        res = await request(server).get(`/api/users/${newId}`)
        expect(res.body).toMatchObject(initialUsers[1])
      }, 500)
      it('responds with the correct message & status code on bad id', async () => {
        let res: Response = await request(server).get('/api/users/foobar')
        expect(res.status).toBe(404)
        expect(res.body.message).toMatch(/does not exist/)
      }, 500)
    })
    describe('[DELETE] /api/users/:id', () => {
      it('responds with deleted user', async () => {
        let [{ id }] = await UserModel.find()
        const choppingBlock = await UserModel.findById(id)
        const res: Response = await request(server).delete(`/api/users/${id}`)
        expect(res.body).toMatchObject(choppingBlock!)
      }, 500)
      it('deletes the user from the db', async () => {
        let [{ id }] = await UserModel.find()
        await request(server).delete(`/api/users/${id}`)
        const gone = await UserModel.findById(id)
        expect(gone).toBeFalsy()
        const survivors: User[] = await UserModel.find()
        expect(survivors).toHaveLength(initialUsers.length - 1)
      }, 500)
      it('responds with the correct message & status code on bad id', async () => {
        const res: Response = await request(server).delete('/api/users/foobar')
        expect(res.status).toBe(404)
        expect(res.body.message).toMatch(/does not exist/)
      }, 500)
    })
    describe('[PUT] /api/users/:id', () => {
      it('responds with updated user', async () => {
        let [{ id }] = await UserModel.find()
        const updates: BaseUser = { name: 'xxx', bio: 'yyy' }
        const res: Response = await request(server).put(`/api/users/${id}`).send(updates)
        expect(res.body).toMatchObject({ id, ...updates })
      }, 500)
      it('saves the updated user to the db', async () => {
        let [_, { id }] = await UserModel.find() // eslint-disable-line
        const updates: BaseUser = { name: 'aaa', bio: 'bbb' }
        await request(server).put(`/api/users/${id}`).send(updates)
        let user = await UserModel.findById(id)
        expect(user).toMatchObject({ id, ...updates })
      }, 500)
      it('responds with the correct message & status code on bad id', async () => {
        const updates: BaseUser = { name: 'xxx', bio: 'yyy' }
        const res: Response = await request(server).put('/api/users/foobar').send(updates)
        expect(res.status).toBe(404)
        expect(res.body.message).toMatch(/does not exist/)
      }, 500)
      it('responds with the correct message & status code on validation problem', async () => {
        let updates: { [key: string]: any } = { name: 'xxx' }
        let res: Response = await request(server).put('/api/users/foobar').send(updates)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/provide name and bio/)
        updates = { bio: 'zzz' }
        res = await request(server).put('/api/users/foobar').send(updates)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/provide name and bio/)
        updates = {}
        res = await request(server).put('/api/users/foobar').send(updates)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/provide name and bio/)
      }, 500)
    })
  })
})
