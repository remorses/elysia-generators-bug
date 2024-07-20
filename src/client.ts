import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

const { data: gen, error } = await app.index.get({})
if (error) throw error

for await (const res of gen) {
    console.log(res)
}
