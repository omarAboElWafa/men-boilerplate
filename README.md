<h1 align="center"></h1>
<h2 align="center">A Boilerplate written with TypeScript on Node.js runtime to achieve scalability, maintainability, and simplicity of coding</h2>

MEN-BOILERPLATE is a boilerplate written with TypeScript on Node.js runtime depending on <strong >the dependency injection pattern </strong> to achieve scalability, maintainability, and simplicity of coding. It is a boilerplate for building scalable server-side applications, using modern technologies such as TypeScript, Node.js, Express, Redis, and MongoDB.

MEN Boilerplate includes essential features that every API requires, such as Mailer, SMS, Authentication, Authorization, Notifications, Payments, Subscriptions, and more.

Say goodbye to weeks of setup and coding. This ready-to-use boilerplate empowers you to jumpstart your
project and prioritize what makes your product unique.

## Structure

<span>
<pre>
.<br>
├── package-lock.json
├── package.json
└── src
    ├── app.ts
    ├── index.ts
    ├── components
    │   └── user
    │       ├── user.controller.ts
    │       ├── user.entities.ts
    │       ├── user.module.ts
    │       ├── user.router.ts
    │       └── user.service.ts
    │
    ├── contracts
    │   ├── errors.ts
    │   ├── mailer.ts
    │   └── user.js
    ├── loaders
    │   └── routes.ts
    │
    ├── utils
    │    ├── cache.ts
    │    ├── config.ts
    │    ├── helpers.ts
    │    ├── hooks.ts
    │    ├── loggers.ts
    │    ├── mailService.ts
    │    ├── middlewares.ts
    │    └── sms.ts
    │
    ├── index.ts
    │
    └── server.ts

</pre>
</span>

## Getting started

### Requirements

- Install [Docker](https://docs.docker.com/get-docker)
- Install [Node.js](https://nodejs.org/en/download/) version 16.14 or above (which can be checked by running `node -v`).
  You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions installed on a single machine.

### Fresh installation

#### Install dependencies

You can install dependencies using `npm`, `pnpm` or `yarn`:

**_Using `npm`:_**

```bash
npm install
```

**_Using `pnpm`:_**

```bash
pnpm install
```

**_Using `yarn`:_**

```bash
yarn install
```

#### Manual setup

For the manual setup clone this repository

### Run existing project

#### Install dependencies

The project is configured to use pnpm workspaces, which means that you can install `node_modules` of all packages in
repository, with single command:

```sh
pnpm install
```

### Start the app

#### Start in Production mode

```sh
npm run start
```

#### Start in Development mode

```sh
npm run dev
```

## Tech stack

- Node.js
- Express
- Typescript
- Redis
- MongoDB
- JWT
- Bcrypt

Infrastructure:

- Linux Ubuntu 20.04
- Github or Bitbucket

3rd party services:

- Stripe (payments and subscriptions) 'To be implemented'
- Twilio (SMS)
- NodeMailer (Emails)

## How was the Boilerplate structured?

### Components

The application was divided into components. Each component has its own module, where we instantiate the controller, service, and router. This helps us keep our code clean and maintainable.

```js
const userService = new UserService();
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);
```

---

### Entities

you’ll also have an entities file where you'll define the DB entities of your component.

```js
export default mongoose.model < IUser > ("User", UserSchema);
```

---

### Routers

Within the router, you should define the URLs of our backend API and call the corresponding controller functions to handle requests.

```js
class UserRouter {
  userController: UserController;
  constructor(UserController: UserController) {
    this.userController = UserController;
  }
  getRouter = () => {
    const router = Router();
    router.post(
      "/register",
      [checkPhone, checkEmail],
      this.userController.register
    );
  };

  // ... rest of the router methods
}
```

---

### Controllers

The controller receives incoming requests from the router and prepares the necessary parameters to call the appropriate service functions. Here, we define the logic for handling each API endpoint of our backend.

```js
class UserController {
  userService: UserService;
  constructor(UserService: UserService) {
    this.userService = UserService;
  }

  register = async (req: Request, res: Response) => {
    // ... controller logic
  };

  // ... rest of the controller methods
}
```

---

### Services

The service is responsible for handling the business logic of our application. It receives the necessary parameters from the controller, calls the corresponding repository functions, and returns the response to the controller.

```js
class UserService {
  addUser = async (user: UserInput<IUser>) => {
    try {
      const newUSer = new User(user);
      return await newUSer.save();
    } catch (error) {
      throw error;
    }
  };

  // ... rest of the service methods
}
```

---

### Modules

The module is where we instantiate the controller, service, and router. This helps us keep our code clean and maintainable.

```js
const userService = new UserService();
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);
```

---

### Main entry points

- index.ts
- server.ts
- loaders/routes.ts

## License

MEN Boilerplate is licensed under the [MIT License](./LICENSE).

## Contributing to MEN Boilerplate

I welcome contributions from anyone interested in improving MEN Boilerplate. Please remember that this project follows a [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a welcoming community for all.

For more detailed information on how to contribute to this project, please refer to our [Contributing Guide](./CONTRIBUTING.md).

If you have any questions about contributing, please contact me on Twitter [Me](https://twitter.com/elwafa60) - I would be happy to talk to you!

Thank you for considering contributing to MEN Boilerplate!
