# Install and Start Development Server

Clone our repository with this command.

```sh
git clone https://github.com/BCSDLab/KOIN_WEB_RECODE.git
cd KOIN_WEB_RECODE
```

Install dependency package and Start the development server!

```sh
yarn
yarn start
```

> We are using [yarn 1](https://classic.yarnpkg.com/en/docs/install). Do not use `npm install` command. Use `yarn` to install dependencies.

## Development flow

- Set up your development environment
- Make an issue for responsible development page
- Make change from a right branch
- Develop your page with [code convention](https://github.com/airbnb/javascript)
- Be sure the code passes `yarn lint` before you commit
- If you want to write commit message, Follow our [commit message guide](./commit-message-convention.md)


## Branch strategy

We are following [git-flow transformation strategy](https://techblog.woowahan.com/2553/).

- main
  - Branch for production server
  - We are using main branch instead of production branch
  - We don't use version tag
- feature
  - Make branch name like `feature/#1`. Number means github issue number
  - Make a Pull Request to develop branch and Call [leader](https://github.com/SimYunSup) for review request.
- develop
  - Branch for development server
  - If you want to publish this version, Make a Pull Request to main branch
