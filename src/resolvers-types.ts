import { ActivityTypeId } from './domain/activity/enums/activity-type.enum';
import { GraphQLResolveInfo } from 'graphql';
import { UserEntity } from './entities/user.entity';
import { ActivityType } from './domain/activity/types/activity-type.type';
import { ActivityEntity } from './entities/activity.entity';
import { EmbeddedActivityDataEntity } from './entities/activities/embedded-activity-data.entity';
import { HtmlActivityDataEntity } from './entities/activities/html-activity-data.entity';
import { CycleEntity } from './entities/cycle.entity';
import { LevelThemeEntity } from './entities/level-theme.entity';
import { LevelEntity } from './entities/level.entity';
import { RoleEntity } from './entities/role.entity';
import { ThemeEntity } from './entities/theme.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { GraphQLContext } from './shared/types/context.type';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export { ActivityTypeId };

export type GQLMutation = {
  readonly __typename?: 'Mutation';
  readonly createTheme?: Maybe<GQLTheme>;
  readonly deactivateTheme?: Maybe<GQLTheme>;
  readonly activateTheme?: Maybe<GQLTheme>;
};


export type GQLMutationcreateThemeArgs = {
  data: GQLThemeData;
};


export type GQLMutationdeactivateThemeArgs = {
  id: Scalars['ID'];
};


export type GQLMutationactivateThemeArgs = {
  id: Scalars['ID'];
};

export type GQLThemeData = {
  readonly name: Scalars['String'];
};

export type GQLQuery = {
  readonly __typename?: 'Query';
  readonly activities: ReadonlyArray<GQLActivityUnion>;
  readonly levels: ReadonlyArray<GQLLevel>;
  readonly theme?: Maybe<GQLTheme>;
  readonly themes: ReadonlyArray<GQLTheme>;
};


export type GQLQuerythemeArgs = {
  id: Scalars['ID'];
};

export type GQLActivityType = {
  readonly __typename?: 'ActivityType';
  readonly id?: Maybe<ActivityTypeId>;
  readonly name: Scalars['String'];
  readonly description: Scalars['String'];
};

export type GQLEmbeddedActivity = GQLActivity & {
  readonly __typename?: 'EmbeddedActivity';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description?: Maybe<Scalars['String']>;
  readonly typeId: ActivityTypeId;
  readonly type: GQLActivityType;
  readonly data: GQLEmbeddedActivityData;
};

export type GQLHtmlActivity = GQLActivity & {
  readonly __typename?: 'HtmlActivity';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description?: Maybe<Scalars['String']>;
  readonly typeId: ActivityTypeId;
  readonly type: GQLActivityType;
  readonly data: GQLHtmlActivityData;
};

export type GQLActivityUnion = GQLEmbeddedActivity | GQLHtmlActivity;

export type GQLActivityData = {
  readonly activityId: Scalars['ID'];
};

export type GQLEmbeddedActivityData = GQLActivityData & {
  readonly __typename?: 'EmbeddedActivityData';
  readonly activityId: Scalars['ID'];
  readonly url: Scalars['String'];
};

export type GQLHtmlActivityData = GQLActivityData & {
  readonly __typename?: 'HtmlActivityData';
  readonly activityId: Scalars['ID'];
  readonly html: Scalars['String'];
};

export type GQLActivity = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description?: Maybe<Scalars['String']>;
  readonly typeId: ActivityTypeId;
  readonly type: GQLActivityType;
};

export type GQLCycle = {
  readonly __typename?: 'Cycle';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly order: Scalars['Int'];
  readonly levelThemeId: Scalars['ID'];
  readonly levelTheme: GQLLevelTheme;
  readonly activities: ReadonlyArray<GQLActivity>;
};

export type GQLLevelTheme = {
  readonly __typename?: 'LevelTheme';
  readonly id: Scalars['ID'];
  readonly levelId: Scalars['ID'];
  readonly themeId: Scalars['ID'];
  readonly order: Scalars['Int'];
  readonly level: GQLLevel;
  readonly theme: GQLTheme;
  readonly cycles: ReadonlyArray<GQLCycle>;
};

export type GQLLevel = {
  readonly __typename?: 'Level';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly order: Scalars['Int'];
  readonly active: Scalars['Boolean'];
  readonly levelThemes: ReadonlyArray<GQLLevelTheme>;
};

export type GQLRole = {
  readonly __typename?: 'Role';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

export type GQLTheme = {
  readonly __typename?: 'Theme';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly active: Scalars['Boolean'];
};

export type GQLUserRole = {
  readonly __typename?: 'UserRole';
  readonly id: Scalars['ID'];
  readonly userId: Scalars['ID'];
  readonly roleId: Scalars['ID'];
  readonly user: GQLUser;
  readonly role: GQLRole;
};

export type GQLUser = {
  readonly __typename?: 'User';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly email: Scalars['String'];
  readonly roles: ReadonlyArray<GQLRole>;
  readonly userRoles: ReadonlyArray<GQLUserRole>;
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

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  ActivityTypeId: ResolverTypeWrapper<Partial<ActivityTypeId>>;
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  ThemeData: ResolverTypeWrapper<Partial<GQLThemeData>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Query: ResolverTypeWrapper<{}>;
  ActivityType: ResolverTypeWrapper<ActivityType>;
  EmbeddedActivity: ResolverTypeWrapper<ActivityEntity>;
  HtmlActivity: ResolverTypeWrapper<ActivityEntity>;
  ActivityUnion: Partial<GQLResolversTypes['EmbeddedActivity'] | GQLResolversTypes['HtmlActivity']>;
  ActivityData: GQLResolversTypes['EmbeddedActivityData'] | GQLResolversTypes['HtmlActivityData'];
  EmbeddedActivityData: ResolverTypeWrapper<EmbeddedActivityDataEntity>;
  HtmlActivityData: ResolverTypeWrapper<HtmlActivityDataEntity>;
  Activity: GQLResolversTypes['EmbeddedActivity'] | GQLResolversTypes['HtmlActivity'];
  Cycle: ResolverTypeWrapper<CycleEntity>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  LevelTheme: ResolverTypeWrapper<LevelThemeEntity>;
  Level: ResolverTypeWrapper<LevelEntity>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  Role: ResolverTypeWrapper<RoleEntity>;
  Theme: ResolverTypeWrapper<ThemeEntity>;
  UserRole: ResolverTypeWrapper<UserRoleEntity>;
  User: ResolverTypeWrapper<UserEntity>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = {
  Mutation: {};
  ID: Partial<Scalars['ID']>;
  ThemeData: Partial<GQLThemeData>;
  String: Partial<Scalars['String']>;
  Query: {};
  ActivityType: ActivityType;
  EmbeddedActivity: ActivityEntity;
  HtmlActivity: ActivityEntity;
  ActivityUnion: Partial<GQLResolversParentTypes['EmbeddedActivity'] | GQLResolversParentTypes['HtmlActivity']>;
  ActivityData: GQLResolversParentTypes['EmbeddedActivityData'] | GQLResolversParentTypes['HtmlActivityData'];
  EmbeddedActivityData: EmbeddedActivityDataEntity;
  HtmlActivityData: HtmlActivityDataEntity;
  Activity: GQLResolversParentTypes['EmbeddedActivity'] | GQLResolversParentTypes['HtmlActivity'];
  Cycle: CycleEntity;
  Int: Partial<Scalars['Int']>;
  LevelTheme: LevelThemeEntity;
  Level: LevelEntity;
  Boolean: Partial<Scalars['Boolean']>;
  Role: RoleEntity;
  Theme: ThemeEntity;
  UserRole: UserRoleEntity;
  User: UserEntity;
};

export type GQLActivityTypeIdResolvers = EnumResolverSignature<{ EMBEDDED?: any, HTML?: any }, GQLResolversTypes['ActivityTypeId']>;

export type GQLMutationResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Mutation'] = GQLResolversParentTypes['Mutation']> = {
  createTheme?: Resolver<Maybe<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLMutationcreateThemeArgs, 'data'>>;
  deactivateTheme?: Resolver<Maybe<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLMutationdeactivateThemeArgs, 'id'>>;
  activateTheme?: Resolver<Maybe<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLMutationactivateThemeArgs, 'id'>>;
};

export type GQLQueryResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query']> = {
  activities?: Resolver<ReadonlyArray<GQLResolversTypes['ActivityUnion']>, ParentType, ContextType>;
  levels?: Resolver<ReadonlyArray<GQLResolversTypes['Level']>, ParentType, ContextType>;
  theme?: Resolver<Maybe<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLQuerythemeArgs, 'id'>>;
  themes?: Resolver<ReadonlyArray<GQLResolversTypes['Theme']>, ParentType, ContextType>;
};

export type GQLActivityTypeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityType'] = GQLResolversParentTypes['ActivityType']> = {
  id?: Resolver<Maybe<GQLResolversTypes['ActivityTypeId']>, ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLEmbeddedActivityResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['EmbeddedActivity'] = GQLResolversParentTypes['EmbeddedActivity']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  typeId?: Resolver<GQLResolversTypes['ActivityTypeId'], ParentType, ContextType>;
  type?: Resolver<GQLResolversTypes['ActivityType'], ParentType, ContextType>;
  data?: Resolver<GQLResolversTypes['EmbeddedActivityData'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLHtmlActivityResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['HtmlActivity'] = GQLResolversParentTypes['HtmlActivity']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  typeId?: Resolver<GQLResolversTypes['ActivityTypeId'], ParentType, ContextType>;
  type?: Resolver<GQLResolversTypes['ActivityType'], ParentType, ContextType>;
  data?: Resolver<GQLResolversTypes['HtmlActivityData'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLActivityUnionResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityUnion'] = GQLResolversParentTypes['ActivityUnion']> = {
  __resolveType: TypeResolveFn<'EmbeddedActivity' | 'HtmlActivity', ParentType, ContextType>;
};

export type GQLActivityDataResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityData'] = GQLResolversParentTypes['ActivityData']> = {
  __resolveType: TypeResolveFn<'EmbeddedActivityData' | 'HtmlActivityData', ParentType, ContextType>;
  activityId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
};

export type GQLEmbeddedActivityDataResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['EmbeddedActivityData'] = GQLResolversParentTypes['EmbeddedActivityData']> = {
  activityId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLHtmlActivityDataResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['HtmlActivityData'] = GQLResolversParentTypes['HtmlActivityData']> = {
  activityId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  html?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLActivityResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Activity'] = GQLResolversParentTypes['Activity']> = {
  __resolveType: TypeResolveFn<'EmbeddedActivity' | 'HtmlActivity', ParentType, ContextType>;
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  typeId?: Resolver<GQLResolversTypes['ActivityTypeId'], ParentType, ContextType>;
  type?: Resolver<GQLResolversTypes['ActivityType'], ParentType, ContextType>;
};

export type GQLCycleResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Cycle'] = GQLResolversParentTypes['Cycle']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  levelThemeId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  levelTheme?: Resolver<GQLResolversTypes['LevelTheme'], ParentType, ContextType>;
  activities?: Resolver<ReadonlyArray<GQLResolversTypes['Activity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLLevelThemeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['LevelTheme'] = GQLResolversParentTypes['LevelTheme']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  levelId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  themeId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  level?: Resolver<GQLResolversTypes['Level'], ParentType, ContextType>;
  theme?: Resolver<GQLResolversTypes['Theme'], ParentType, ContextType>;
  cycles?: Resolver<ReadonlyArray<GQLResolversTypes['Cycle']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLLevelResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Level'] = GQLResolversParentTypes['Level']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  active?: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  levelThemes?: Resolver<ReadonlyArray<GQLResolversTypes['LevelTheme']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLRoleResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Role'] = GQLResolversParentTypes['Role']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLThemeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Theme'] = GQLResolversParentTypes['Theme']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  active?: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLUserRoleResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['UserRole'] = GQLResolversParentTypes['UserRole']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  roleId?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  role?: Resolver<GQLResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLUserResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['User'] = GQLResolversParentTypes['User']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  roles?: Resolver<ReadonlyArray<GQLResolversTypes['Role']>, ParentType, ContextType>;
  userRoles?: Resolver<ReadonlyArray<GQLResolversTypes['UserRole']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQLResolvers<ContextType = GraphQLContext> = {
  ActivityTypeId?: GQLActivityTypeIdResolvers;
  Mutation?: GQLMutationResolvers<ContextType>;
  Query?: GQLQueryResolvers<ContextType>;
  ActivityType?: GQLActivityTypeResolvers<ContextType>;
  EmbeddedActivity?: GQLEmbeddedActivityResolvers<ContextType>;
  HtmlActivity?: GQLHtmlActivityResolvers<ContextType>;
  ActivityUnion?: GQLActivityUnionResolvers;
  ActivityData?: GQLActivityDataResolvers;
  EmbeddedActivityData?: GQLEmbeddedActivityDataResolvers<ContextType>;
  HtmlActivityData?: GQLHtmlActivityDataResolvers<ContextType>;
  Activity?: GQLActivityResolvers;
  Cycle?: GQLCycleResolvers<ContextType>;
  LevelTheme?: GQLLevelThemeResolvers<ContextType>;
  Level?: GQLLevelResolvers<ContextType>;
  Role?: GQLRoleResolvers<ContextType>;
  Theme?: GQLThemeResolvers<ContextType>;
  UserRole?: GQLUserRoleResolvers<ContextType>;
  User?: GQLUserResolvers<ContextType>;
};


