import {NgModule} from '@angular/core';
import { ApolloClientOptions } from 'apollo-client';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { environment } from 'src/environments/environment';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import introspectionResult from './shared/graphql/generated/instrospection-result';

const uri = environment.graphqlUrl;

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: introspectionResult,
  });

  const inMemoryCache = new InMemoryCache({
    fragmentMatcher: fragmentMatcher,
    freezeResults: !environment.production,
  });

  return {
    link: httpLink.create({uri: uri}),
    cache: inMemoryCache,
    assumeImmutableResults: true,
    ssrMode: false,
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],  
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    }
  ],
})
export class GraphQLModule { }
