import { treaty } from '@elysiajs/eden'
import { sleep } from 'bun'
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/yieldedItemsBecomeAString', async function* generator() {
        yield JSON.stringify({ hello: 'world 1' })
        // if you add sleep(100) here it gets fixed
        yield JSON.stringify({ hello: 'world 2' })
    })
    .get('/yieldedObjectsBecomeObjectObject', async function* generator() {
        await sleep(100)
        yield { body: 'Hello Elysia' } // this will be [object Object]
    })
    .get('/yieldedJsonStringsBecomeObjects', async function* generator() {
        await sleep(100) // add sleep to fix string output bug
        yield JSON.stringify({ body: 'Hello Elysia' }) // this will be the object {"hello":"world"} in Eden, should remain string instead
    })
    .listen(3000, async () => {
        const app = treaty<App>('localhost:3000')

        {
            const { data: gen, error } =
                await app.yieldedItemsBecomeAString.get({})
            if (error) throw error

            for await (const res of gen) {
                console.log('yieldedItemsBecomeAString', res)
            }
        }
        {
            const { data: gen, error } =
                await app.yieldedObjectsBecomeObjectObject.get({})
            if (error) throw error

            for await (const res of gen) {
                console.log('yieldedObjectsBecomeObjectObject', res)
            }
        }
        {
            const { data: gen, error } =
                await app.yieldedJsonStringsBecomeObjects.get({})
            if (error) throw error

            for await (const res of gen) {
                console.log('yieldedJsonStringsBecomeObjects', res)
            }
        }
    })

export type App = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
