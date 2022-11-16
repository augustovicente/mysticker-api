/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async () => {
    return { hello: 'world' }
})

Route.get('health', async ({ response }) => {
    const report = await HealthCheck.getReport()
    return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.post('login', 'AuthController.login');
Route.post('register', 'UserController.register'); // TODO
Route.post('reset-password-by-link', 'AuthController.resetPassword'); // TODO
Route.post('forgot-password', 'AuthController.resetPassword'); // TODO

Route.post('reset-password', 'AuthController.resetPassword').middleware('auth'); // TODO
Route.post('authenticate-user', 'AuthController.authenticateUser').middleware('auth');
Route.post('edit-data', 'UserController.edit_data').middleware('auth'); // TODO
