# vercel-scratch-proxy
A serverless proxy to get information about scratch users, studios and more!

# Routes
## DjangoBB (s2forums)
### `GET` /api/djangobb/feed
Get the feed of a specific forum topic.
#### Query Parameters
| Parameter | Description  | Expected Type |
| --------- | ------------ | ------------- |
| f         | The topic id | `Number`      |

## scratchr2
### `GET` /api/scratchr2/user
Get a user.
#### Query Parameters
| Parameter | Description  | Expected Type |
| --------- | ------------ | ------------- |
| u         | The username | `String`      |

## Developing
```bash
# install
npm install

# start dev server
npm run dev
```