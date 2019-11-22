type Token<T> = {
  (): T;
  optional: Token<void | T>;
  stacks: Array<{
    type:
      | 'token'
      | 'plugin'
      | 'register'
      | 'enhance'
      | 'alias-from'
      | 'alias-to';
    stack: string;
  }>;
};

declare module 'fusion-react';
declare module 'fusion-core' {
  import {Context as KoaContext} from 'koa';

  type ExtendedKoaContext = KoaContext & {
    memoized: Map<Record<string, any>, unknown>;
  };
  type SanitizedHTMLWrapper = Record<string, any>;

  export type SSRContext = {
    element: any;
    template: {
      htmlAttrs: Record<string, any>;
      title: string;
      head: Array<SanitizedHTMLWrapper>;
      body: Array<SanitizedHTMLWrapper>;
      bodyAttrs: {[attr: string]: string};
    };
  } & ExtendedKoaContext;

  export type Context = SSRContext | ExtendedKoaContext;

  type Middleware = (
    ctx: Context,
    next: () => Promise<void>
  ) => Promise<unknown>;

  type MapDeps<Deps> = {
    [P in keyof Deps]: Deps[P] extends Token<infer V> ? V : never;
  };

  interface FusionPlugin<Deps, Service> {
    __plugin__: boolean;
    stack: string;
    deps?: Deps;
    provides?: (Deps: MapDeps<Deps>) => Service;
    middleware?: (Deps: MapDeps<Deps & {}>, Service: Service) => Middleware;
    cleanup?: (service: Service) => Promise<void>;
  }

  export type ServiceType<TPlugin> = TPlugin extends FusionPlugin<
    infer Deps,
    infer Service
  >
    ? Service
    : never;

  type FusionPluginNoHidden<TDeps, TService> = Omit<
    Omit<FusionPlugin<TDeps, TService>, '__plugin__'>,
    'stack'
  >;

  export function createPlugin<TDeps, TService>(
    opts: FusionPluginNoHidden<TDeps, TService>
  ): FusionPlugin<TDeps, TService>;

  export function createToken<TResolvedType>(
    name: string
  ): Token<TResolvedType>;

  export type SSRDecider = (ctx: Context) => boolean;
  export const SSRDeciderToken: Token<SSRDecider>;
  export const RenderToken: Token<any>;
}
declare module 'fusion-plugin-react-router' {
  export * from 'react-router';
}
declare module 'fusion-plugin-styletron-react' {
  export const Styletron: any;
}
declare module 'fusion-plugin-jwt' {
  export const SessionSecretToken: Token<string>;
  export const SessionCookieNameToken: Token<string>;
  export const SessionCookieExpiresToken: Token<number>;
}
declare module 'fusion-tokens' {
  import {Context} from 'fusion-core';

  interface Session {
    set: <T>(key: string, value: T) => T;
    get: <T>(key: string) => T;
  }
  export const SessionToken: Token<{from: (ctx: Context) => Session}>;
  export const FetchToken: Token<any>;
}

declare module 'fusion-plugin-apollo' {
  export const ApolloRenderEnhancer: any;
  export const ApolloClientPlugin: any;
  export const ApolloClientToken: Token<any>;
  export const GraphQLSchemaToken: Token<any>;
  export function gql(path: string): any;
}

declare module 'graphql-tools' {
  export function makeExecutableSchema(args: {
    typeDefs: any;
    resolvers: any;
  }): void;
}
