import NodeCache from "node-cache";

const cache = new NodeCache();

if(cache)
    console.log('Starting node-cache...')

export {
    cache
};