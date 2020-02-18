import VaultClient from 'node-vault-client';

export default function(options) {
  client = new VaultClient(options);

  return async (params, watcher) => {
    const [path, refreshIntervalString] = params.split(' ');
    const refreshInterval = parseInt(refreshIntervalString, 10);

    const res = await client.read(params);
    let value = res.__data;
    if (refreshInterval) {
      setInterval(async () => {
        const refreshRes = await client.read(params);

        if (refreshRes.__data !== value) {
          value = refreshRes.__data;
          watcher(value);
        }
      }, refreshInterval);
    }

    return value;
  };
}

