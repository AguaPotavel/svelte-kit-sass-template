import { PrismaClient } from "@prisma/client";
import { init } from "@paralleldrive/cuid2"
const prisma = new PrismaClient()

const createId = init({
  length: 10,
  fingerprint: "email-countdown"
})

const createUser = async ({ email, password, verified }: { email: string, verified: boolean, password?: string }) => {
  const user = await getUser(email)

  if (user) throw new Error("Invalid email, already exists!")

  return await prisma.user.create({
    data: {
      id: createId(),
      email: email,
      password: password,
      verified: verified
    }
  })
}

const getUser = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email: email
    }
  })
}

const findOrCreate = async ({ email, password, verified }: { email: string, verified: boolean, password?: string }) => {
  let user = await getUser(email)

  if (user) return user;

  return await createUser({ email, password, verified })
}

export { createUser, getUser, findOrCreate }
