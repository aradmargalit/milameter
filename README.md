# MilaMeter

Pronounced mee-la mee-ter

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Requirements

- Node 18.12.1
- `npm`

## Getting Started

### Configure your environment file

Copy `env.local.sample` and rename as `env.local`. Update the values with the relevant secrets from Slack.

```sh
npm install # install dependencies

npm run dev # start a local dev server, available on port :3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## API Routes

You can use the NextJS server as an API. Any files under `pages/api` which export a default function will be available at `http://localhost:3000/api/{filename}`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Documentation

Still hankerin' for more information? See these details here.

### Authentication

* We use [next-auth](https://next-auth.js.org/) to manage our OAuth 2.0 connection with Strava
* Sign in is available at `/auth/signin`

### Styling

We use [Joy UI](https://mui.com/joy-ui/getting-started/overview/), a variant of Material UI that accelerates development and has beautiful components out of the box.

_Note: Joy UI is in alpha at the time of writing and is somewhat unstable_

### Next 13 app directory adoption
As of Next 13, the `app` directory [is in Beta](https://beta.nextjs.org/docs/getting-started). During early development, this was sufficiently unstable that we bailed on it, but may opt back in as it gains support.