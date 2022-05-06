// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
import shortid from 'shortid';
import { BaseUser, User } from './user.interface';

function initializeUsers(): User[] {
  return ([
    { id: shortid.generate(), name: 'Ed Carter', bio: 'hero' },
    { id: shortid.generate(), name: 'Mary Edwards', bio: 'super hero' },
  ])
}

// FAKE IN-MEMORY USERS "TABLE"
let users: User[] = initializeUsers()

// DATABASE ACCESS FUNCTIONS
// DATABASE ACCESS FUNCTIONS
// DATABASE ACCESS FUNCTIONS
export function find(): Promise<User[]> {
  // SELECT * FROM users;
  return Promise.resolve(users)
}

export function findById(id: string): Promise<User | undefined> {
  // SELECT * FROM users WHERE id = 1;
  const user = users.find(d => d.id === id)
  return Promise.resolve(user)
}

export function insert(userInfo: BaseUser): Promise<User> {
  // INSERT INTO users (name, bio) VALUES ('foo', 'bar');
  const newUser: User = { id: shortid.generate(), name: userInfo.name, bio: userInfo.bio }
  users.push(newUser)
  return Promise.resolve(newUser)
}

export function update(id: string, changes: BaseUser): Promise<null | User> {
  // UPDATE users SET name = 'foo', bio = 'bar WHERE id = 1;
  const user: User | undefined = users.find(user => user.id === id)
  if (!user) return Promise.resolve(null)

  const updatedUser: User = { ...changes, id }
  users = users.map(d => (d.id === id) ? updatedUser : d)
  return Promise.resolve(updatedUser)
}

export function remove(id: string): Promise<null | User> {
  // DELETE FROM users WHERE id = 1;
  const user: User | undefined = users.find(user => user.id === id)
  if (!user) return Promise.resolve(null)

  users = users.filter(d => d.id !== id)
  return Promise.resolve(user)
}

export function resetDB(): void {
  users = initializeUsers()
}
