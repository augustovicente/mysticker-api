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

import Event from '@ioc:Adonis/Core/Event'
import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
    const report = await HealthCheck.getReport()
    return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.post('login', 'AuthController.login');
Route.post('register', 'UserController.register');
Route.post('verify-email/:code', 'AuthController.verify_email');
Route.post('forgot-password', 'AuthController.forgot_password');
Route.post('reset-password-by-link/:code', 'AuthController.reset_password_by_link');

Route.post('reset-password', 'AuthController.reset_password').middleware('auth');
Route.post('get-authenticated-user', 'AuthController.get_authenticated_user').middleware('auth');
Route.post('edit-data', 'UserController.edit_data').middleware('auth');
Route.post('vinculate-wallet', 'UserController.vinculate_wallet').middleware('auth');
Route.post('unvinculate-wallet', 'UserController.vinculate_wallet').middleware('auth');

Route.post('open-package', 'DrawController.open_package').middleware('auth');
Route.post('paste-stickers', 'DrawController.paste_sticker').middleware('auth');

Route.post('has-redeem/:prize_type', 'UserController.has_redeem').middleware('auth');
Route.post('redeem', 'UserController.redeem').middleware('auth');

Route.post('buy-package', 'UserController.buy_package').middleware('auth');

Event.on('db:query', function ({ sql, bindings }) {
    console.log(sql, bindings)
})
