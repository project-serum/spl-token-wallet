# MeuSol - Uma Carteira Digital em Português para o Solana

Example Solana wallet with support for [SPL tokens](https://spl.solana.com/token) and Serum integration.

See [sollet.io](https://www.sollet.io) for a demo.

Wallet keys are stored in `localStorage`, optionally encrypted by a password.

Run `yarn start` to start a development server or `yarn build` to create a production build that can be served by a static file server.

See the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for other commands and options.

# Build 
docker run --rm -it -p 8080:80 react-nginx