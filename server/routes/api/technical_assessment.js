const express = require('express');
const axios   = require('axios');

const router = express.Router();
const { ETHERSCAN_API_KEY } = process.env;

router.get('/', async (req, res) => {
  try {
    const address = (req.query.address || '').trim().toLowerCase();

    if (!/^0x[0-9a-fA-F]{40}$/.test(address))
      return res.status(400).json({ error: 'Invalid or missing contract address' });

    const url =
      `https://api.etherscan.io/api?module=account&action=txlist`+
      `&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc`+
      `&apikey=${ETHERSCAN_API_KEY}`;

    const { data } = await axios.get(url);

    if (data.status !== '1' || !data.result?.length)
      return res.status(502).json({ error: 'Etherscan did not return a creation transaction' });

    const firstTx   = data.result[0];
    const result = {
      contractAddress:     address,
      creatorAddress:      firstTx.from.toLowerCase(),
      creationTxHash:      firstTx.hash,
      deploymentTimestamp: Number(firstTx.timeStamp),
      networkName:         'ethereum',
      chainId:             1
    };

    return res.json(result);
  } catch (err) {
    console.error('technical_assessment route error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;