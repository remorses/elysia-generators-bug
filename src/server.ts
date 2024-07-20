import { treaty } from '@elysiajs/eden'
import { sleep } from 'bun'
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/yielded-items-become-a-single-string', async function* generator() {
        yield JSON.stringify({ hello: 'world 1' })
        // if you add sleep(100) here it gets fixed
        yield JSON.stringify({ hello: 'world 2' })
    })
    .get('/yielded-objects-become-object-object', async function* generator() {
        await sleep(100)
        yield { body: 'Hello Elysia' } // this will be [object Object]
    })
    .get(
        '/yielded-json-strings-become-objects-in-eden',
        async function* generator() {
            await sleep(100) // add sleep to fix string output bug
            yield JSON.stringify({ body: 'Hello Elysia' }) // this will be the object {"hello":"world"} in Eden, should remain string instead
        },
    )
    .listen(3000, async () => {
        const app = treaty<App>('localhost:3000')

        {
            const { data: gen, error } = await app[
                'yielded-items-become-a-single-string'
            ].get({})
            if (error) throw error

            for await (const res of gen) {
                console.log('yielded-items-become-a-single-string', res)
            }
        }
        console.log()
        {
            const { data: gen, error } = await app[
                'yielded-objects-become-object-object'
            ].get({})
            if (error) throw error

            for await (const res of gen) {
                console.log('yielded-objects-become-object-object', res)
            }
        }
        console.log()
        {
            const { data: gen, error } = await app[
                'yielded-json-strings-become-objects-in-eden'
            ].get({})
            if (error) throw error

            for await (const res of gen) {
                console.log(
                    'this should be a string, instead it is an',
                    typeof res,
                )
                console.log('yielded-json-strings-become-objects-in-eden', res)
            }
        }
    })

export type App = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
