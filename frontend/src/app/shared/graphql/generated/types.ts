export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
};

export type Category = {
  readonly __typename: 'Category';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly products: Maybe<ReadonlyArray<Maybe<Product>>>;
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
};

export type CreateCategoryInput = {
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};

export type CreateProductInput = {
  readonly name: Scalars['String'];
  readonly price: Scalars['Int'];
  readonly categoryId: Scalars['Int'];
};

export type CreateUserInput = {
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};


export type GenericError = {
  readonly message: Scalars['String'];
};

export type Log = {
  readonly __typename: 'Log';
  readonly id: Scalars['ID'];
  readonly body: Maybe<Scalars['String']>;
  readonly key: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly createdAt: Maybe<Scalars['String']>;
};

export type Mutation = {
  readonly __typename: 'Mutation';
  readonly createCategory: Category;
  readonly updateCategory: Category;
  readonly createProduct: Product;
  readonly updateProduct: Product;
  readonly createUser: User;
  readonly updateUser: User;
};


export type MutationcreateCategoryArgs = {
  data: CreateCategoryInput;
};


export type MutationupdateCategoryArgs = {
  data: UpdateCategoryInput;
};


export type MutationcreateProductArgs = {
  data: CreateProductInput;
};


export type MutationupdateProductArgs = {
  data: UpdateProductInput;
};


export type MutationcreateUserArgs = {
  data: CreateUserInput;
};


export type MutationupdateUserArgs = {
  data: UpdateUserInput;
};

export type Product = {
  readonly __typename: 'Product';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly price: Scalars['Int'];
  readonly categoryId: Scalars['ID'];
  readonly category: Maybe<ReadonlyArray<Maybe<Category>>>;
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
};

export type Query = {
  readonly __typename: 'Query';
  readonly categoryAll: ReadonlyArray<Category>;
  readonly categoryId: Maybe<Category>;
  readonly category: Maybe<Category>;
  readonly productAll: ReadonlyArray<Product>;
  readonly productId: Maybe<Product>;
  readonly product: Maybe<Product>;
  readonly userAll: ReadonlyArray<User>;
  readonly userId: Maybe<User>;
  readonly user: Maybe<User>;
};


export type QuerycategoryIdArgs = {
  id: Scalars['ID'];
};


export type QuerycategoryArgs = {
  filters: categoryQueryInput;
};


export type QueryproductIdArgs = {
  id: Scalars['ID'];
};


export type QueryproductArgs = {
  filters: productQueryInput;
};


export type QueryuserIdArgs = {
  id: Scalars['ID'];
};


export type QueryuserArgs = {
  filters: userQueryInput;
};

export type SimpleError = GenericError & {
  readonly __typename: 'SimpleError';
  readonly message: Scalars['String'];
};

export type UpdateCategoryInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};

export type UpdateProductInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly price: Scalars['Int'];
  readonly categoryId: Scalars['Int'];
};

export type UpdateUserInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
};

export type User = {
  readonly __typename: 'User';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
};

export type categoryQueryInput = {
  readonly id?: Maybe<Scalars['ID']>;
};

export type productQueryInput = {
  readonly id?: Maybe<Scalars['ID']>;
};

export type userQueryInput = {
  readonly id?: Maybe<Scalars['ID']>;
};
