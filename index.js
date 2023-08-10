import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch';
const app = express();
app.use(cors());
app.use(express.json());

app.get('/*', async (req, res) => {

  const baseUrl = process.env.PROXY_TARGET_BASE_URL
  if (!baseUrl) {
    return res.status(400).json({
      message: 'proxy target is an invalid url; please set a PROXY_TARGET_URL as env var -- example (https://host.com) '
    })
  }

  const targetUrl = baseUrl + req.path;
  console.log('GET Request to: ', req.path);
  console.log('Proxying GET to: ', targetUrl);
  try {
    const resp = await fetch(targetUrl, {
      method: 'GET',
      headers: req.headers
    })
    console.log('Response status: ', resp.status)
    if (resp.status >= 400) {
      try {
        console.log('Response body: ', text)
        const json = await resp.json();
        return res.status(resp.status).json(json)
      } catch {
        const text = await resp.text();
        return res.status(resp.status).json({
          message: text
        })
      }
    }
    const json = await resp.json();
    return res.status(resp.status).json(json)
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: 'unexpected server error'
    })
  }


})


app.post('/*', async (req, res) => {

  const baseUrl = process.env.PROXY_TARGET_BASE_URL
  if (!baseUrl) {
    return res.status(400).json({
      message: 'proxy target is an invalid url; please set a PROXY_TARGET_URL as env var -- example (https://host.com) '
    })
  }

  const targetUrl = baseUrl + req.path;


  console.log('POST Request to: ', req.path);
  console.log('Proxying POST to: ', targetUrl);
  console.log('POST request headers: ', req.headers)
  try {
    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(req.body)
    })
    console.log('Response status: ', resp.status)
    if (resp.status >= 400) {
      try {
        console.log('Response body: ', text)
        const json = await resp.json();
        return res.status(resp.status).json(json)
      } catch {
        const text = await resp.text();
        return res.status(resp.status).json({
          message: text
        })
      }
    }
    const json = await resp.json();
    return res.status(resp.status).json(json)
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: 'unexpected server error'
    })
  }

})

app.listen(4000, () => {
  console.log('listening at 4000')
})