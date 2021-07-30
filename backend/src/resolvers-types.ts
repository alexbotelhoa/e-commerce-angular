import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { SimpleError } from './shared/types/errors/simple-error.type';
import { GenericError } from './shared/types/errors/generic-error.interface';
import { UserEntity } from './entities/user.entity';
import { CategoryEntity } from './entities/category.entity';
import { ProductEntity } from './entities/product.entity';
import { GraphQLContext } from './shared/types/context.type';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type GQLMutation = {
  readonly __typename?: 'Mutation';
  readonly createCategory: GQLCategory;
  readonly createProduct: GQLProduct;
  readonly createUser: GQLUser;
  readonly updateCategory: GQLCategory;
  readonly updateProduct: GQLProduct;
  readonly updateUser: GQLUser;
};


export type GQLMutationcreateCategoryArgs = {
  data: GQLCreateCategoryInput;
};


export type GQLMutationcreateProductArgs = {
  data: GQLCreateProductInput;
};


export type GQLMutationcreateUserArgs = {
  data: GQLCreateUserInput;
};


export type GQLMutationupdateCategoryArgs = {
  data: GQLUpdateCategoryInput;
};


export type GQLMutationupdateProductArgs = {
  data: GQLUpdateProductInput;
};


export type GQLMutationupdateUserArgs = {
  data: GQLUpdateUserInput;
};

export type GQLCreateCategoryInput = {
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};

export type GQLUpdateCategoryInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};

export type GQLQuery = {
  readonly __typename?: 'Query';
  readonly categoryAll: ReadonlyArray<GQLCategory>;
  readonly categoryByField: Maybe<GQLCategory>;
  readonly categoryById: Maybe<GQLCategory>;
  readonly productAll: ReadonlyArray<GQLProduct>;
  readonly productByField: Maybe<GQLProduct>;
  readonly productById: Maybe<GQLProduct>;
  readonly userAll: ReadonlyArray<GQLUser>;
  readonly userByField: Maybe<GQLUser>;
  readonly userById: Maybe<GQLUser>;
};


export type GQLQuerycategoryByFieldArgs = {
  fields: GQLcategoryQueryInput;
};


export type GQLQuerycategoryByIdArgs = {
  id: Scalars['ID'];
};


export type GQLQueryproductByFieldArgs = {
  fields: GQLproductQueryInput;
};


export type GQLQueryproductByIdArgs = {
  id: Scalars['ID'];
};


export type GQLQueryuserByFieldArgs = {
  fields: GQLuserQueryInput;
};


export type GQLQueryuserByIdArgs = {
  id: Scalars['ID'];
};

export type GQLcategoryQueryInput = {
  readonly id: Maybe<Scalars['ID']>;
};

export type GQLCategory = {
  readonly __typename?: 'Category';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly products: Maybe<ReadonlyArray<Maybe<GQLProduct>>>;
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
};

export type GQLCreateProductInput = {
  readonly name: Scalars['String'];
  readonly price: Scalars['Int'];
  readonly categoryId: Scalars['Int'];
};

export type GQLUpdateProductInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly price: Scalars['Int'];
  readonly categoryId: Scalars['Int'];
};

export type GQLproductQueryInput = {
  readonly id: Maybe<Scalars['ID']>;
};

export type GQLProduct = {
  readonly __typename?: 'Product';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly price: Scalars['Int'];
  readonly categoryId: Scalars['ID'];
  readonly category: Maybe<ReadonlyArray<Maybe<GQLCategory>>>;
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
};

export type GQLCreateUserInput = {
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};

export type GQLUpdateUserInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};

export type GQLuserQueryInput = {
  readonly id: Maybe<Scalars['ID']>;
};

export type GQLUser = {
  readonly __typename?: 'User';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
};

export type GQLLog = {
  readonly __typename?: 'Log';
  readonly id: Scalars['ID'];
  readonly body: Maybe<Scalars['String']>;
  readonly key: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly createdAt: Maybe<Scalars['String']>;
};


export type GQLGenericError = {
  readonly message: Scalars['String'];
};

export type GQLSimpleError = GQLGenericError & {
  readonly __typename?: 'SimpleError';
  readonly message: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GQLResolversTypes = {
  Mutation: ResolverTypeWrapper<{}>;
  CreateCategoryInput: GQLCreateCategoryInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateCategoryInput: GQLUpdateCategoryInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Query: ResolverTypeWrapper<{}>;
  categoryQueryInput: GQLcategoryQueryInput;
  Category: ResolverTypeWrapper<CategoryEntity>;
  CreateProductInput: GQLCreateProductInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  UpdateProductInput: GQLUpdateProductInput;
  productQueryInput: GQLproductQueryInput;
  Product: ResolverTypeWrapper<ProductEntity>;
  CreateUserInput: GQLCreateUserInput;
  UpdateUserInput: GQLUpdateUserInput;
  userQueryInput: GQLuserQueryInput;
  User: ResolverTypeWrapper<UserEntity>;
  Log: ResolverTypeWrapper<GQLLog>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  GenericError: ResolverTypeWrapper<GenericError>;
  SimpleError: ResolverTypeWrapper<SimpleError>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = {
  Mutation: {};
  CreateCategoryInput: GQLCreateCategoryInput;
  String: Scalars['String'];
  UpdateCategoryInput: GQLUpdateCategoryInput;
  ID: Scalars['ID'];
  Query: {};
  categoryQueryInput: GQLcategoryQueryInput;
  Category: CategoryEntity;
  CreateProductInput: GQLCreateProductInput;
  Int: Scalars['Int'];
  UpdateProductInput: GQLUpdateProductInput;
  productQueryInput: GQLproductQueryInput;
  Product: ProductEntity;
  CreateUserInput: GQLCreateUserInput;
  UpdateUserInput: GQLUpdateUserInput;
  userQueryInput: GQLuserQueryInput;
  User: UserEntity;
  Log: GQLLog;
  DateTime: Scalars['DateTime'];
  GenericError: GenericError;
  SimpleError: SimpleError;
  Boolean: Scalars['Boolean'];
};

export type GQLMutationResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Mutation'] = GQLResolversParentTypes['Mutation']> = {
  createCategory: Resolver<GQLResolversTypes['Category'], ParentType, ContextType, RequireFields<GQLMutationcreateCategoryArgs, 'data'>>;
  createProduct: Resolver<GQLResolversTypes['Product'], ParentType, ContextType, RequireFields<GQLMutationcreateProductArgs, 'data'>>;
  createUser: Resolver<GQLResolversTypes['User'], ParentType, ContextType, RequireFields<GQLMutationcreateUserArgs, 'data'>>;
  updateCategory: Resolver<GQLResolversTypes['Category'], ParentType, ContextType, RequireFields<GQLMutationupdateCategoryArgs, 'data'>>;
  updateProduct: Resolver<GQLResolversTypes['Product'], ParentType, ContextType, RequireFields<GQLMutationupdateProductArgs, 'data'>>;
  updateUser: Resolver<GQLResolversTypes['User'], ParentType, ContextType, RequireFields<GQLMutationupdateUserArgs, 'data'>>;
};

export type GQLQueryResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query']> = {
  categoryAll: Resolver<ReadonlyArray<GQLResolversTypes['Category']>, ParentType, ContextType>;
  categoryByField: Resolver<Maybe<GQLResolversTypes['Category']>, ParentType, ContextType, RequireFields<GQLQuerycategoryByFieldArgs, 'fields'>>;
  categoryById: Resolver<Maybe<GQLResolversTypes['Category']>, ParentType, ContextType, RequireFields<GQLQuerycategoryByIdArgs, 'id'>>;
  productAll: Resolver<ReadonlyArray<GQLResolversTypes['Product']>, ParentType, ContextType>;
  productByField: Resolver<Maybe<GQLResolversTypes['Product']>, ParentType, ContextType, RequireFields<GQLQueryproductByFieldArgs, 'fields'>>;
  productById: Resolver<Maybe<GQLResolversTypes['Product']>, ParentType, ContextType, RequireFields<GQLQueryproductByIdArgs, 'id'>>;
  userAll: Resolver<ReadonlyArray<GQLResolversTypes['User']>, ParentType, ContextType>;
  userByField: Resolver<Maybe<GQLResolversTypes['User']>, ParentType, ContextType, RequireFields<GQLQueryuserByFieldArgs, 'fields'>>;
  userById: Resolver<Maybe<GQLResolversTypes['User']>, ParentType, ContextType, RequireFields<GQLQueryuserByIdArgs, 'id'>>;
};

export type GQLCategoryResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Category'] = GQLResolversParentTypes['Category']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  products: Resolver<Maybe<ReadonlyArray<Maybe<GQLResolversTypes['Product']>>>, ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLProductResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Product'] = GQLResolversParentTypes['Product']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  price: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  categoryId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  category: Resolver<Maybe<ReadonlyArray<Maybe<GQLResolversTypes['Category']>>>, ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLUserResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['User'] = GQLResolversParentTypes['User']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLLogResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Log'] = GQLResolversParentTypes['Log']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  body: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  key: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GQLDateTimeScalarConfig extends GraphQLScalarTypeConfig<GQLResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GQLGenericErrorResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['GenericError'] = GQLResolversParentTypes['GenericError']> = {
  __resolveType: TypeResolveFn<'SimpleError', ParentType, ContextType>;
  message: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
};

export type GQLSimpleErrorResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['SimpleError'] = GQLResolversParentTypes['SimpleError']> = {
  message: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLResolvers<ContextType = GraphQLContext> = {
  Mutation: GQLMutationResolvers<ContextType>;
  Query: GQLQueryResolvers<ContextType>;
  Category: GQLCategoryResolvers<ContextType>;
  Product: GQLProductResolvers<ContextType>;
  User: GQLUserResolvers<ContextType>;
  Log: GQLLogResolvers<ContextType>;
  DateTime: GraphQLScalarType;
  GenericError: GQLGenericErrorResolvers<ContextType>;
  SimpleError: GQLSimpleErrorResolvers<ContextType>;
};


