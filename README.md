# coordinates-lawnmower

Pickup an area on a map and output a lawn mower pattern for drone surveying.
For shallow water photogrammetry, the usual tools do not allow tight bandwidth.

Output format is to be fed on Emlid Reach.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Deploy
You can deploy as a classic vue application, or use github pages.
(Then, you shall have to edit the script in order to setup the site repo url).

```
./deploy.sh
```
