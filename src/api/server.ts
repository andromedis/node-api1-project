// Imports
import express, { Request, Response } from 'express';
import * as UserModel from './users/model';
import { BaseUser, User } from './users/user.interface';
 
// Express instance with middleware
export const server = express()
server.use(express.json())

 
// Endpoints
// POST | /api/users | Creates a user using the information sent inside the `request body`.
server.post('/api/users', (req: Request, res: Response) => {
    const newUser: BaseUser = req.body
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ message: 'Please provide name and bio for the user' })
    }
    else {
        UserModel.insert(newUser)
            .then((user: User) => {
                res.status(201).json(user)
            })
            .catch(_err => {
                res.status(500).json({ message: 'There was an error while saving the user to the database' })
            })
    }
})
 
// GET | /api/users/:id | Returns the user object with the specified `id`.
server.get('/api/users/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    UserModel.findById(id)
        .then((user: User | undefined) => {
            const [ status, json ] = user 
                ? [200, user] 
                : [404, { message: 'The user with the specified ID does not exist' }]
            res.status(status).json(json)
        })
        .catch(_err => {
            res.status(500).json({ message: 'The user information could not be retrieved' })
        })
})
 
// GET | /api/users | Returns an array users.
server.get('/api/users', (req: Request, res: Response) => {
    UserModel.find()
        .then((users: User[]) => {
            res.status(200).json(users)
        })
        .catch(_err => {
            res.status(500).json({ message: 'The users information could not be retrieved' })
        })
})
 
// DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.
server.delete('/api/users/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    UserModel.remove(id)
        .then((deletedUser: User | null) => {
            const [ status, json ] = deletedUser 
                ? [201, deletedUser] 
                : [404, { message: 'The user with the specified ID does not exist' }]
            res.status(status).json(json)
        })
        .catch(_err => {
            res.status(500).json({ message: 'The user could not be removed' })
        })
})
 
// PUT | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user
server.put('/api/users/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    const changes: BaseUser = req.body
    if (!changes.name || !changes.bio) {
        res.status(400).json({ message: 'Please provide name and bio for the user' })
    }
    else {
        UserModel.update(id, changes)
            .then((updatedUser: User | null) => {
                const [ status, json ] = updatedUser 
                    ? [200, updatedUser] 
                    : [404, { message: 'The user with the specified ID does not exist' }]
                res.status(status).json(json)
            })
            .catch(_err => {
                res.status(500).json({ message: 'The user information could not be modified' })
            })
    }
})
 