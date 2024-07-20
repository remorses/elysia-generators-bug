import { treaty } from '@elysiajs/eden'

import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', async function* generator() {
        await sleep(100)
        yield JSON.stringify({ body: 'Hello Elysia' })
        yield JSON.stringify({ body: 'Hello Elysia' })
        yield JSON.stringify({ body: 'Hello Elysia' })
        yield JSON.stringify({ body: 'Hello Elysia' })
        yield JSON.stringify({ body: 'Hello Elysia' })
    })
    .listen(3000, async () => {
        const app = treaty<App>('localhost:3000')

        {
            const { data: gen, error } = await app.index.get({})
            if (error) throw error

            for await (const res of gen) {
                console.log(res)
            }
        }
    })

export type App = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}