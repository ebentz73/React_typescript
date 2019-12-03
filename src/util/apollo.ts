import {DataProxy} from 'apollo-cache';

interface DataProxyExt extends DataProxy {
  data?: {
    data: {[key: string]: string};
    delete: (key: string) => void;
    depend: {
      dirty: (key: string) => void;
    };
  };
}

export const deleteCacheForQuery = (queryName: string) => (
  proxy: DataProxyExt
) => {
  const cache = proxy.data;
  if (cache) {
    Object.keys(cache.data.ROOT_QUERY)
      .filter(name => name.startsWith(queryName))
      .forEach(name => {
        delete cache.data.ROOT_QUERY[name];
      });
    cache.depend.dirty('ROOT_QUERY');
  }
};
