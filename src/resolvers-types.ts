import { ActivityTypeId } from './domain/activity/enums/activity-type.enum';
import { LevelTypeId } from './domain/activity/enums/level-type.enum';
import { RoleId } from './domain/authorization/enums/role-id.enum';
import { PermissionId } from './domain/authorization/enums/permission-id.enum';
import { GradeTypeId } from './domain/activity/enums/grade-type-id.enum';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { AvatarEntity } from './entities/avatar.entity';
import { UserEntity } from './entities/user.entity';
import { ActivityType } from './domain/activity/types/activity-type.type';
import { ActivityEntity } from './entities/activity.entity';
import { EmbeddedActivityDataEntity } from './entities/activities/embedded-activity-data.entity';
import { ActivityTimerEntity } from './entities/activities/activity-timer.entity';
import { HtmlActivityDataEntity } from './entities/activities/html-activity-data.entity';
import { ClassEntity } from './entities/class.entity';
import { ActivityCommentEntity } from './entities/comments/activity-comment.entity';
import { CycleEntity } from './entities/cycle.entity';
import { CycleActivityEntity } from './entities/cycle-activity.entity';
import { EnrollmentEntity } from './entities/enrollment.entity';
import { EnrollmentClassEntity } from './entities/enrollment-class.entity';
import { TeacherClassEntity } from './entities/teacher-class.entity';
import { LevelThemeEntity } from './entities/level-theme.entity';
import { LevelCodeEntity } from './entities/level-code.entity';
import { LevelEntity } from './entities/level.entity';
import { ThemeEntity } from './entities/theme.entity';
import { ChatEntity } from './entities/chat.entity';
import { ChatMessageEntity } from './entities/chat-message.entity';
import { ThemeIconEntity } from './entities/theme-icon.entity';
import { ChallengeEntity } from './entities/challenge.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { Role } from './domain/authorization/types/role.type';
import { Permission } from './domain/authorization/types/permission.type';
import { SimpleError } from './shared/types/errors/simple-error.type';
import { GenericError } from './shared/types/errors/generic-error.interface';
import { DeleteActivityCommentSuccessResult } from './domain/activity/mutations/delete-activity-comment/delete-activity-comment-success-result.type';
import { ClassStudentGrade } from './domain/activity/types/class-student-grade.type';
import { StudentGrade } from './domain/activity/types/student-grade.type';
import { GraphQLContext } from './shared/types/context.type';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
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

export { ActivityTypeId };

export { GradeTypeId };

export { LevelTypeId };

export type GQLMutation = {
  readonly __typename?: 'Mutation';
  readonly activateActivity: GQLActivityUnion;
  readonly activateChallenge: Maybe<GQLChallenge>;
  readonly activateCycle: GQLCycle;
  readonly activateLevel: GQLLevel;
  readonly activateNewsletter: Maybe<GQLNewsletter>;
  readonly activateTheme: Maybe<GQLTheme>;
  readonly addActivitiesToCycle: GQLCycle;
  readonly addThemesToLevel: GQLLevel;
  readonly audit: Maybe<Scalars['Boolean']>;
  readonly chatMakeRead: Maybe<Scalars['Boolean']>;
  readonly completeActivity: GQLCompleteActivityResult;
  readonly createChallenge: GQLChallenge;
  readonly createCommentOnActivity: GQLCreateCommentOnActivityResult;
  readonly createCycle: GQLCycle;
  readonly createEmbeddedActivity: GQLEmbeddedActivity;
  readonly createHtmlActivity: GQLHtmlActivity;
  readonly createLevel: GQLLevel;
  readonly createLevelCode: GQLLevelCode;
  readonly createNewsletter: GQLNewsletter;
  readonly createTheme: GQLTheme;
  readonly deactivateActivity: GQLActivityUnion;
  readonly deactivateChallenge: Maybe<GQLChallenge>;
  readonly deactivateCycle: GQLCycle;
  readonly deactivateLevel: GQLLevel;
  readonly deactivateNewsletter: Maybe<GQLNewsletter>;
  readonly deactivateTheme: Maybe<GQLTheme>;
  readonly deleteActivityComment: GQLDeleteActivityCommentResult;
  readonly deleteActivityFromCycle: GQLCycle;
  readonly deleteCycleFromLevelTheme: GQLLevelTheme;
  readonly deleteThemeFromLevel: GQLLevel;
  readonly finishOnboard: GQLUser;
  readonly insertChat: Maybe<Scalars['Boolean']>;
  readonly presence: Maybe<Scalars['Boolean']>;
  readonly startActivity: GQLStartActivityResult;
  readonly updateBasicLevelInfo: GQLLevel;
  readonly updateChallenge: GQLChallenge;
  readonly updateCycle: GQLCycle;
  readonly updateCycleActivitiesOrder: ReadonlyArray<GQLCycleActivity>;
  readonly updateCyclesOrder: ReadonlyArray<GQLCycle>;
  readonly updateEmbeddedActivity: GQLEmbeddedActivity;
  readonly updateLevelThemesOrder: ReadonlyArray<GQLLevelTheme>;
  readonly updateNewsletter: GQLNewsletter;
  readonly updateTheme: GQLTheme;
  readonly updateUserRoles: Maybe<Scalars['Boolean']>;
  readonly upsertAnnotation: Maybe<GQLAnnotation>;
  readonly upsertOrRemoveUserInterest: Maybe<GQLInterest>;
  readonly viewerChangeAvatar: GQLViewerChangeAvatarMutationResult;
};


export type GQLMutationactivateActivityArgs = {
  id: Scalars['ID'];
};


export type GQLMutationactivateChallengeArgs = {
  id: Scalars['ID'];
};


export type GQLMutationactivateCycleArgs = {
  id: Scalars['ID'];
};


export type GQLMutationactivateLevelArgs = {
  id: Scalars['ID'];
};


export type GQLMutationactivateNewsletterArgs = {
  id: Scalars['ID'];
};


export type GQLMutationactivateThemeArgs = {
  id: Scalars['ID'];
};


export type GQLMutationaddActivitiesToCycleArgs = {
  data: GQLAddActivitiesToCycleInput;
};


export type GQLMutationaddThemesToLevelArgs = {
  data: GQLAddThemesToLevelInput;
};


export type GQLMutationauditArgs = {
  data: GQLAuditInput;
};


export type GQLMutationcompleteActivityArgs = {
  data: GQLCompleteActivityInput;
};


export type GQLMutationcreateChallengeArgs = {
  data: GQLCreateChallengeInput;
};


export type GQLMutationcreateCommentOnActivityArgs = {
  data: GQLCreateCommentOnActivityInput;
};


export type GQLMutationcreateCycleArgs = {
  data: GQLCreateCycleInput;
};


export type GQLMutationcreateEmbeddedActivityArgs = {
  data: GQLCreateEmbeddedActivityInput;
};


export type GQLMutationcreateHtmlActivityArgs = {
  data: GQLCreateHtmlActivityInput;
};


export type GQLMutationcreateLevelArgs = {
  data: GQLCreateLevelInput;
};


export type GQLMutationcreateLevelCodeArgs = {
  data: GQLCreateLevelCodeInput;
};


export type GQLMutationcreateNewsletterArgs = {
  data: GQLCreateNewsletterInput;
};


export type GQLMutationcreateThemeArgs = {
  data: GQLCreateThemeInput;
};


export type GQLMutationdeactivateActivityArgs = {
  id: Scalars['ID'];
};


export type GQLMutationdeactivateChallengeArgs = {
  id: Scalars['ID'];
};


export type GQLMutationdeactivateCycleArgs = {
  id: Scalars['ID'];
};


export type GQLMutationdeactivateLevelArgs = {
  id: Scalars['ID'];
};


export type GQLMutationdeactivateNewsletterArgs = {
  id: Scalars['ID'];
};


export type GQLMutationdeactivateThemeArgs = {
  id: Scalars['ID'];
};


export type GQLMutationdeleteActivityCommentArgs = {
  data: GQLDeleteActivityCommentInput;
};


export type GQLMutationdeleteActivityFromCycleArgs = {
  cycleActivityId: Scalars['ID'];
};


export type GQLMutationdeleteCycleFromLevelThemeArgs = {
  cycleId: Scalars['ID'];
};


export type GQLMutationdeleteThemeFromLevelArgs = {
  levelThemeId: Scalars['ID'];
};


export type GQLMutationinsertChatArgs = {
  payload: GQLInsertChatInput;
};


export type GQLMutationpresenceArgs = {
  turma: Scalars['String'];
};


export type GQLMutationstartActivityArgs = {
  data: GQLStartActivityInput;
};


export type GQLMutationupdateBasicLevelInfoArgs = {
  data: GQLUpdateBasicLevelInfoInput;
};


export type GQLMutationupdateChallengeArgs = {
  data: GQLUpdateChallengeInput;
};


export type GQLMutationupdateCycleArgs = {
  data: GQLUpdateCycleInput;
};


export type GQLMutationupdateCycleActivitiesOrderArgs = {
  data: ReadonlyArray<GQLUpdateCycleActivitiesOrderInput>;
};


export type GQLMutationupdateCyclesOrderArgs = {
  data: ReadonlyArray<GQLUpdateCyclesOrderInput>;
};


export type GQLMutationupdateEmbeddedActivityArgs = {
  data: GQLUpdateEmbeddedActivityInput;
};


export type GQLMutationupdateLevelThemesOrderArgs = {
  data: ReadonlyArray<GQLUpdateLevelThemesOrderInput>;
};


export type GQLMutationupdateNewsletterArgs = {
  data: GQLUpdateNewsletterInput;
};


export type GQLMutationupdateThemeArgs = {
  data: GQLUpdateThemeInput;
};


export type GQLMutationupdateUserRolesArgs = {
  data: GQLUpdateUserRolesInput;
};


export type GQLMutationupsertAnnotationArgs = {
  annotation: GQLAnnotationUpsertInput;
};


export type GQLMutationupsertOrRemoveUserInterestArgs = {
  data: GQLUpsertUserInterestInput;
};


export type GQLMutationviewerChangeAvatarArgs = {
  data: GQLViewerChangeAvatarInput;
};

export type GQLCreateEmbeddedActivityInput = {
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly active: Scalars['Boolean'];
  readonly estimatedTime: Scalars['String'];
  readonly data: GQLEmbeddedActivityDataInput;
};

export type GQLCreateHtmlActivityInput = {
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly active: Scalars['Boolean'];
  readonly estimatedTime: Scalars['String'];
  readonly data: GQLHtmlActivityDataInput;
};

export type GQLEmbeddedActivityDataInput = {
  readonly url: Scalars['String'];
  readonly height: Scalars['Int'];
};

export type GQLHtmlActivityDataInput = {
  readonly html: Scalars['String'];
};

export type GQLUpdateEmbeddedActivityInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Scalars['String'];
  readonly active: Scalars['Boolean'];
  readonly estimatedTime: Scalars['String'];
  readonly data: GQLEmbeddedActivityDataInput;
};

export type GQLCompleteActivityInput = {
  readonly cycleActivityId: Scalars['ID'];
  readonly classId: Scalars['ID'];
};

export type GQLCompleteActivityResult = GQLActivityTimer | GQLSimpleError;

export type GQLCreateCommentOnActivityInput = {
  readonly activityId: Scalars['ID'];
  readonly comment: Scalars['String'];
  readonly classId: Scalars['ID'];
  readonly parentCommentId: Maybe<Scalars['ID']>;
};

export type GQLCreateCommentOnActivityResult = GQLActivityComment | GQLSimpleError;

export type GQLUpdateCycleActivitiesOrderInput = {
  readonly cycleActivityId: Scalars['ID'];
  readonly order: Scalars['Int'];
};

export type GQLCreateCycleInput = {
  readonly name: Scalars['String'];
  readonly levelThemeId: Scalars['ID'];
  readonly active: Scalars['Boolean'];
  readonly order: Scalars['Int'];
};

export type GQLUpdateCycleInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly active: Scalars['Boolean'];
  readonly order: Scalars['Int'];
};

export type GQLAddActivitiesToCycleItemsInput = {
  readonly activityId: Scalars['ID'];
  readonly order: Maybe<Scalars['Int']>;
};

export type GQLAddActivitiesToCycleInput = {
  readonly cycleId: Scalars['ID'];
  readonly items: ReadonlyArray<GQLAddActivitiesToCycleItemsInput>;
};

export type GQLUpdateCyclesOrderInput = {
  readonly cycleId: Scalars['ID'];
  readonly order: Scalars['Int'];
};

export type GQLDeleteActivityCommentInput = {
  readonly commentId: Scalars['ID'];
};

export type GQLDeleteActivityCommentSuccessResult = {
  readonly __typename?: 'DeleteActivityCommentSuccessResult';
  readonly success: Scalars['Boolean'];
  readonly activity: GQLActivityUnion;
};

export type GQLDeleteActivityCommentResult = GQLDeleteActivityCommentSuccessResult | GQLSimpleError;

export type GQLUpdateLevelThemesOrderInput = {
  readonly levelThemeId: Scalars['ID'];
  readonly order: Scalars['Int'];
};

export type GQLCreateLevelCodeInput = {
  readonly id: Scalars['ID'];
  readonly code: Scalars['ID'];
  readonly description: Scalars['String'];
  readonly active: Scalars['Boolean'];
};

export type GQLCreateLevelInput = {
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly typeId: LevelTypeId;
  readonly order: Scalars['Int'];
  readonly active: Scalars['Boolean'];
  readonly codes: ReadonlyArray<Scalars['ID']>;
};

export type GQLAddThemesToLevelItemsInput = {
  readonly themeId: Scalars['ID'];
  readonly order: Maybe<Scalars['Int']>;
};

export type GQLAddThemesToLevelInput = {
  readonly levelId: Scalars['ID'];
  readonly items: ReadonlyArray<GQLAddThemesToLevelItemsInput>;
};

export type GQLUpdateBasicLevelInfoInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly typeId: LevelTypeId;
  readonly order: Scalars['Int'];
  readonly active: Scalars['Boolean'];
  readonly codes: ReadonlyArray<Scalars['ID']>;
};

export type GQLStartActivityInput = {
  readonly cycleActivityId: Scalars['ID'];
  readonly classId: Scalars['ID'];
};

export type GQLStartActivityResult = GQLActivityTimer | GQLSimpleError;

export type GQLCreateThemeInput = {
  readonly name: Scalars['String'];
  readonly startColor: Scalars['String'];
  readonly endColor: Scalars['String'];
  readonly icon: GQLIconDataInput;
};

export type GQLIconDataInput = {
  readonly content: Scalars['String'];
};

export type GQLUpdateThemeInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly startColor: Scalars['String'];
  readonly endColor: Scalars['String'];
  readonly active: Scalars['Boolean'];
  readonly icon: GQLIconDataInput;
};

export type GQLQuery = {
  readonly __typename?: 'Query';
  readonly Annotation: Maybe<GQLAnnotation>;
  readonly Annotations: ReadonlyArray<GQLAnnotation>;
  readonly Carrer: Maybe<ReadonlyArray<Maybe<GQLCarrer>>>;
  readonly activeChallenge: Maybe<GQLChallenge>;
  readonly activities: ReadonlyArray<GQLActivityUnion>;
  readonly activitiesListByProgressOrder: ReadonlyArray<GQLActivitiesListByProgressOrder>;
  readonly activity: Maybe<GQLActivityUnion>;
  readonly activityComments: ReadonlyArray<GQLActivityComment>;
  readonly availableActivitiesForCycle: ReadonlyArray<GQLActivityUnion>;
  readonly availableThemes: ReadonlyArray<GQLTheme>;
  readonly avatars: ReadonlyArray<GQLAvatar>;
  readonly backup: Maybe<ReadonlyArray<Maybe<GQLBackup>>>;
  readonly challenge: Maybe<GQLChallenge>;
  readonly challenges: ReadonlyArray<GQLChallenge>;
  readonly chatHeader: ReadonlyArray<GQLChat>;
  readonly chatMessage: ReadonlyArray<Maybe<GQLChatMessage>>;
  readonly chatNewMessages: ReadonlyArray<Maybe<GQLChat>>;
  readonly chatNotifications: ReadonlyArray<Maybe<GQLChat>>;
  readonly chatStudents: ReadonlyArray<GQLChat>;
  readonly class: Maybe<GQLClass>;
  readonly classCycles: ReadonlyArray<GQLCycle>;
  readonly classLevelThemes: ReadonlyArray<GQLLevelTheme>;
  readonly classStudents: ReadonlyArray<GQLUser>;
  readonly classes: ReadonlyArray<GQLClass>;
  readonly count: ReadonlyArray<GQLCount>;
  readonly currentUser: Maybe<GQLUser>;
  readonly cycle: Maybe<GQLCycle>;
  readonly cycleActivities: ReadonlyArray<GQLCycleActivity>;
  readonly cycleActivity: Maybe<GQLCycleActivity>;
  readonly cycles: ReadonlyArray<GQLCycle>;
  readonly getServiceNow: Maybe<Scalars['String']>;
  readonly getZoom: Maybe<Scalars['String']>;
  readonly icons: ReadonlyArray<GQLThemeIcon>;
  readonly interest: ReadonlyArray<GQLInterest>;
  readonly learningMoreOption: Maybe<GQLLevelCode>;
  readonly level: Maybe<GQLLevel>;
  readonly levelCodes: ReadonlyArray<GQLLevelCode>;
  readonly levelTheme: Maybe<GQLLevelTheme>;
  readonly levelThemes: ReadonlyArray<GQLLevelTheme>;
  readonly levels: ReadonlyArray<GQLLevel>;
  readonly logs: ReadonlyArray<GQLLog>;
  readonly meet: Maybe<GQLMeeting>;
  readonly myEnrollments: ReadonlyArray<GQLEnrollment>;
  readonly myLevels: ReadonlyArray<GQLLevel>;
  readonly newsletter: Maybe<GQLNewsletter>;
  readonly newsletters: ReadonlyArray<GQLNewsletter>;
  readonly newslettersActive: ReadonlyArray<GQLNewsletter>;
  readonly occLogin: GQLOccResult;
  readonly overallClassCompletedActivities: Maybe<GQLOverallClassCompletedActivities>;
  readonly progressStudents: GQLProgressStudent;
  readonly teacherClasses: ReadonlyArray<GQLTeacherClass>;
  readonly teacherClassesActivated: ReadonlyArray<GQLTeacherClassesActivated>;
  readonly theme: Maybe<GQLTheme>;
  readonly themeTotal: Maybe<ReadonlyArray<GQLThemeTotal>>;
  readonly themes: ReadonlyArray<GQLTheme>;
  readonly user: Maybe<ReadonlyArray<GQLUser>>;
  readonly userRole: Maybe<GQLUserRole>;
  readonly userRoles: ReadonlyArray<GQLUserRole>;
  readonly viewerEnrollmentLevelCodes: ReadonlyArray<GQLLevelCode>;
  readonly viewerTeacherClasses: ReadonlyArray<GQLTeacherClass>;
  readonly viewerTeacherLevelCodes: ReadonlyArray<GQLLevelCode>;
};


export type GQLQueryAnnotationArgs = {
  id: Scalars['ID'];
};


export type GQLQueryAnnotationsArgs = {
  search: Maybe<Scalars['String']>;
  date: Maybe<Scalars['String']>;
  annotationId: Maybe<Scalars['String']>;
};


export type GQLQueryactivitiesListByProgressOrderArgs = {
  courseId: Scalars['ID'];
};


export type GQLQueryactivityArgs = {
  id: Scalars['ID'];
};


export type GQLQueryactivityCommentsArgs = {
  data: GQLActivityCommentsQueryInput;
};


export type GQLQueryavailableActivitiesForCycleArgs = {
  cycleId: Scalars['ID'];
};


export type GQLQueryavailableThemesArgs = {
  availableThemesInputData: GQLAvailableThemesInputData;
};


export type GQLQuerybackupArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  withAutomatic: Scalars['Boolean'];
};


export type GQLQuerychallengeArgs = {
  id: Scalars['ID'];
};


export type GQLQuerychatHeaderArgs = {
  userId: Scalars['String'];
};


export type GQLQuerychatMessageArgs = {
  userId: Maybe<Scalars['String']>;
};


export type GQLQuerychatNewMessagesArgs = {
  userId: Scalars['String'];
};


export type GQLQuerychatStudentsArgs = {
  data: Maybe<GQLChatStudentsQueryInput>;
};


export type GQLQueryclassArgs = {
  id: Scalars['ID'];
};


export type GQLQueryclassCyclesArgs = {
  classId: Scalars['ID'];
};


export type GQLQueryclassLevelThemesArgs = {
  classId: Scalars['ID'];
};


export type GQLQueryclassStudentsArgs = {
  data: GQLClassStudentsQueryInput;
};


export type GQLQueryclassesArgs = {
  data: Maybe<GQLClassesQueryInput>;
};


export type GQLQuerycountArgs = {
  data: Maybe<GQLcountQueryInput>;
};


export type GQLQuerycycleArgs = {
  id: Scalars['ID'];
};


export type GQLQuerycycleActivityArgs = {
  id: Scalars['ID'];
};


export type GQLQuerygetZoomArgs = {
  classId: Scalars['ID'];
};


export type GQLQueryinterestArgs = {
  filters: GQLInterestPaginationData;
};


export type GQLQuerylearningMoreOptionArgs = {
  filters: GQLlearningMoreOptionsInput;
};


export type GQLQuerylevelArgs = {
  id: Scalars['ID'];
};


export type GQLQuerylevelThemeArgs = {
  id: Scalars['ID'];
};


export type GQLQuerylevelThemesArgs = {
  data: GQLLevelThemesQueryInput;
};


export type GQLQuerylogsArgs = {
  data: Maybe<GQLLogsQueryInput>;
};


export type GQLQuerymeetArgs = {
  id: Scalars['ID'];
};


export type GQLQuerynewsletterArgs = {
  id: Scalars['ID'];
};


export type GQLQueryoverallClassCompletedActivitiesArgs = {
  classId: Scalars['ID'];
};


export type GQLQueryprogressStudentsArgs = {
  data: GQLProgressStudentsQueryInput;
};


export type GQLQueryteacherClassesArgs = {
  data: GQLTeacherClassesQueryInput;
};


export type GQLQuerythemeArgs = {
  id: Scalars['ID'];
};


export type GQLQuerythemeTotalArgs = {
  classId: Scalars['ID'];
};


export type GQLQueryuserArgs = {
  data: Maybe<GQLUserQueryInput>;
};


export type GQLQueryuserRoleArgs = {
  id: Scalars['ID'];
};


export type GQLQueryuserRolesArgs = {
  data: Maybe<GQLUserRolesQueryInput>;
};


export type GQLQueryviewerEnrollmentLevelCodesArgs = {
  filters: Maybe<GQLViewerEnrollmenLevelCodestFilterInput>;
};


export type GQLQueryviewerTeacherLevelCodesArgs = {
  filters: Maybe<GQLViewerTeacherLevelCodesFilterInput>;
};

export type GQLActivitiesListByProgressOrder = {
  readonly __typename?: 'ActivitiesListByProgressOrder';
  readonly partId: Scalars['ID'];
  readonly activityId: Scalars['ID'];
  readonly cycleOrder: Scalars['ID'];
};

export type GQLActivityCommentsQueryInput = {
  readonly activityId: Scalars['ID'];
  readonly classIds: Maybe<ReadonlyArray<Scalars['ID']>>;
};

export type GQLLevelThemesQueryInput = {
  readonly levelId: Scalars['ID'];
  readonly enrollmentStudent: Maybe<Scalars['ID']>;
};

export type GQLAvailableThemesInputData = {
  readonly levelId: Scalars['ID'];
};

export type GQLClass = {
  readonly __typename?: 'Class';
  readonly campusId: Maybe<Scalars['ID']>;
  readonly carrerId: Maybe<Scalars['ID']>;
  readonly endDate: Maybe<Scalars['DateTime']>;
  readonly hasActivated: Maybe<Scalars['Boolean']>;
  readonly hasEcampus: Maybe<Scalars['Boolean']>;
  readonly hasEyoung: Maybe<Scalars['Boolean']>;
  readonly id: Scalars['ID'];
  readonly institutionId: Maybe<Scalars['ID']>;
  readonly levelCode: GQLLevelCode;
  readonly levelCodeId: Scalars['ID'];
  readonly localId: Maybe<Scalars['ID']>;
  readonly name: Scalars['String'];
  readonly periodId: Maybe<Scalars['ID']>;
  readonly regionalId: Maybe<Scalars['ID']>;
  readonly sessionId: Maybe<Scalars['ID']>;
  readonly startDate: Maybe<Scalars['DateTime']>;
  readonly studentGrades: ReadonlyArray<GQLClassStudentGrade>;
};


export type GQLClassstudentGradesArgs = {
  data: Maybe<GQLClassStudentGradesInput>;
};

export type GQLClassStudentGradesInput = {
  readonly studentIds: Maybe<ReadonlyArray<Scalars['ID']>>;
};

export type GQLUser = {
  readonly __typename?: 'User';
  readonly accountId: Maybe<Scalars['String']>;
  readonly avatar: Maybe<GQLAvatar>;
  readonly avatarId: Maybe<Scalars['ID']>;
  readonly defaultLevelTypeId: LevelTypeId;
  readonly hasEcampus: Maybe<Scalars['Boolean']>;
  readonly hasEyoung: Maybe<Scalars['Boolean']>;
  readonly id: Scalars['ID'];
  readonly initials: Scalars['String'];
  readonly isAdult: Maybe<Scalars['Boolean']>;
  readonly isTeacher: Scalars['Boolean'];
  readonly macId: Maybe<Scalars['String']>;
  readonly macPass: Maybe<Scalars['String']>;
  readonly materials: Maybe<ReadonlyArray<Maybe<GQLMaterial>>>;
  readonly name: Scalars['String'];
  readonly onboarded: Scalars['Boolean'];
  readonly roles: ReadonlyArray<GQLRole>;
  readonly studentLevel: GQLstudentLevel;
  readonly teacherClasses: ReadonlyArray<GQLTeacherClass>;
  readonly totalAvailableActivities: Scalars['Int'];
  readonly totalCompletedActivities: Scalars['Int'];
  readonly totalProgressChecksCompletedForClass: Scalars['Int'];
  readonly userInterest: ReadonlyArray<GQLUserInterest>;
  readonly userRoles: ReadonlyArray<GQLUserRole>;
};


export type GQLUsertotalCompletedActivitiesArgs = {
  classId: Maybe<Scalars['ID']>;
};


export type GQLUsertotalProgressChecksCompletedForClassArgs = {
  classId: Scalars['ID'];
};

export type GQLActivityType = {
  readonly __typename?: 'ActivityType';
  readonly id: ActivityTypeId;
  readonly name: Scalars['String'];
  readonly description: Scalars['String'];
};

export type GQLEmbeddedActivity = GQLActivity & {
  readonly __typename?: 'EmbeddedActivity';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly typeId: ActivityTypeId;
  readonly type: GQLActivityType;
  readonly data: GQLEmbeddedActivityData;
  readonly active: Scalars['Boolean'];
  readonly estimatedTime: Scalars['String'];
};

export type GQLHtmlActivity = GQLActivity & {
  readonly __typename?: 'HtmlActivity';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly typeId: ActivityTypeId;
  readonly type: GQLActivityType;
  readonly data: GQLHtmlActivityData;
  readonly active: Scalars['Boolean'];
  readonly estimatedTime: Scalars['String'];
};

export type GQLActivityUnion = GQLEmbeddedActivity | GQLHtmlActivity;

export type GQLClassStudentGrade = {
  readonly __typename?: 'ClassStudentGrade';
  readonly studentId: Scalars['ID'];
  readonly totalActivities: Scalars['Int'];
  readonly totalProgressChecks: Scalars['Int'];
  readonly completedActivities: Scalars['Int'];
  readonly completedProgressChecks: Scalars['Int'];
  readonly completionGrade: Scalars['Float'];
  readonly progressCheckGrade: Scalars['Float'];
  readonly grades: ReadonlyArray<GQLStudentGrade>;
};

export type GQLStudentGrade = {
  readonly __typename?: 'StudentGrade';
  readonly typeId: GradeTypeId;
  readonly grade: Scalars['Float'];
};

export type GQLAnnotationUpsertInput = {
  readonly data: Scalars['String'];
  readonly meetingId: Maybe<Scalars['String']>;
  readonly id: Maybe<Scalars['String']>;
};

export { PermissionId };

export { RoleId };

export type GQLPermission = {
  readonly __typename?: 'Permission';
  readonly id: PermissionId;
  readonly name: Scalars['String'];
  readonly description: Scalars['String'];
};

export type GQLRole = {
  readonly __typename?: 'Role';
  readonly id: RoleId;
  readonly name: Scalars['String'];
  readonly permissions: ReadonlyArray<GQLPermission>;
};

export type GQLViewerChangeAvatarInput = {
  readonly avatarId: Scalars['ID'];
};

export type GQLViewerChangeAvatarMutationError = GQLGenericError & {
  readonly __typename?: 'ViewerChangeAvatarMutationError';
  readonly message: Scalars['String'];
};

export type GQLViewerChangeAvatarMutationResult = GQLUser | GQLViewerChangeAvatarMutationError;

export type GQLCreateChallengeInput = {
  readonly text: Scalars['String'];
  readonly startAt: Scalars['String'];
  readonly endAt: Scalars['String'];
};

export type GQLUpdateChallengeInput = {
  readonly id: Scalars['ID'];
  readonly text: Scalars['String'];
  readonly startAt: Scalars['String'];
  readonly endAt: Scalars['String'];
};

export type GQLInsertChatInput = {
  readonly userId: Maybe<Scalars['String']>;
  readonly classId: Maybe<Scalars['String']>;
  readonly levelThemeId: Maybe<Scalars['Int']>;
  readonly cycleActivityId: Maybe<Scalars['Int']>;
  readonly isEtutor: Maybe<Scalars['Boolean']>;
  readonly message: Maybe<Scalars['String']>;
};

export type GQLChatStudentsQueryInput = {
  readonly userIds: Maybe<ReadonlyArray<Scalars['ID']>>;
};

export type GQLClassesQueryInput = {
  readonly ids: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly institutionIds: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly sessionIds: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly periodIds: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly carrerIds: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly search: Maybe<Scalars['String']>;
};

export type GQLcountQueryInput = {
  readonly ids: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly search: Maybe<Scalars['String']>;
};

export type GQLViewerEnrollmenLevelCodestFilterInput = {
  readonly last30days: Maybe<Scalars['Boolean']>;
  readonly userId: Maybe<Scalars['ID']>;
};

export type GQLUpsertUserInterestInput = {
  readonly interestId: Scalars['Int'];
};

export type GQLInterestPaginationData = {
  readonly page: Maybe<Scalars['ID']>;
  readonly perpage: Maybe<Scalars['ID']>;
};

export type GQLlearningMoreOptionsInput = {
  readonly levelId: Maybe<Scalars['ID']>;
};

export type GQLAuditInput = {
  readonly id_plataforma: Scalars['Int'];
  readonly id_recurso: Scalars['Int'];
  readonly id_turma: Scalars['String'];
};

export type GQLLogsQueryInput = {
  readonly ids: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly userId: Maybe<Scalars['String']>;
  readonly search: Maybe<Scalars['String']>;
  readonly perPage: Maybe<Scalars['ID']>;
  readonly page: Maybe<Scalars['ID']>;
  readonly orderBy: Maybe<Scalars['String']>;
};

export type GQLOccResult = {
  readonly __typename?: 'OccResult';
  readonly tokenSaml: Scalars['String'];
  readonly urlSubmit: Scalars['String'];
};

export type GQLCreateNewsletterInput = {
  readonly name: Scalars['String'];
  readonly linkUrl: Scalars['String'];
  readonly imgSrc: Scalars['String'];
};

export type GQLUpdateNewsletterInput = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly linkUrl: Scalars['String'];
  readonly imgSrc: Scalars['String'];
};

export type GQLCycle = {
  readonly __typename?: 'Cycle';
  readonly active: Scalars['Boolean'];
  readonly activities: ReadonlyArray<GQLCycleActivity>;
  readonly classOverallCompletion: Scalars['Float'];
  readonly classOverallCompletionRatio: Scalars['Float'];
  readonly id: Scalars['ID'];
  readonly levelTheme: GQLLevelTheme;
  readonly levelThemeId: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly order: Scalars['Int'];
  readonly studentHasCompleted: Scalars['Boolean'];
  readonly totalActivities: Scalars['Int'];
  readonly viewerHasCompleted: Scalars['Boolean'];
};


export type GQLCycleclassOverallCompletionArgs = {
  classId: Scalars['ID'];
};


export type GQLCycleclassOverallCompletionRatioArgs = {
  classId: Scalars['ID'];
};


export type GQLCyclestudentHasCompletedArgs = {
  studentId: Scalars['ID'];
};

export type GQLLevelTheme = {
  readonly __typename?: 'LevelTheme';
  readonly classOverallCompletion: Scalars['Float'];
  readonly classOverallCompletionRatio: Scalars['Float'];
  readonly cycles: ReadonlyArray<GQLCycle>;
  readonly id: Scalars['ID'];
  readonly level: GQLLevel;
  readonly levelId: Scalars['ID'];
  readonly order: Scalars['Int'];
  readonly studentTotalCompletedActivities: Scalars['Int'];
  readonly theme: GQLTheme;
  readonly themeId: Scalars['ID'];
  readonly totalActivities: Scalars['Int'];
  readonly totalCycles: Scalars['Int'];
  readonly viewerTotalCompletedActivities: Scalars['Int'];
};


export type GQLLevelThemeclassOverallCompletionArgs = {
  classId: Scalars['ID'];
};


export type GQLLevelThemeclassOverallCompletionRatioArgs = {
  classId: Scalars['ID'];
};


export type GQLLevelThemestudentTotalCompletedActivitiesArgs = {
  studentId: Scalars['ID'];
};

export type GQLClassStudentsQueryInput = {
  readonly classId: Scalars['ID'];
};

export type GQLOverallClassCompletedActivities = {
  readonly __typename?: 'OverallClassCompletedActivities';
  readonly classId: Scalars['ID'];
  readonly totalActivities: Scalars['Int'];
  readonly completedActivities: Scalars['Int'];
  readonly totalStudents: Scalars['Int'];
  readonly overallCompletion: Scalars['Float'];
};

export type GQLProgressStudent = {
  readonly __typename?: 'ProgressStudent';
  readonly name: Scalars['String'];
  readonly totalActivities: Scalars['Int'];
  readonly totalActivitiesCompleted: Scalars['Int'];
};

export type GQLProgressStudentsQueryInput = {
  readonly classId: Scalars['ID'];
  readonly studentId: Scalars['ID'];
};

export type GQLLevelCodeItem = {
  readonly __typename?: 'LevelCodeItem';
  readonly levelId: Scalars['String'];
};

export type GQLClassItem = {
  readonly __typename?: 'ClassItem';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly levelCode: GQLLevelCodeItem;
};

export type GQLTeacherClassesActivated = {
  readonly __typename?: 'TeacherClassesActivated';
  readonly code: Scalars['String'];
  readonly class: Maybe<GQLClassItem>;
};

export type GQLTeacherClassesQueryInput = {
  readonly teacherIds: Maybe<ReadonlyArray<Scalars['ID']>>;
};

export type GQLViewerTeacherLevelCodesFilterInput = {
  readonly last30days: Maybe<Scalars['Boolean']>;
  readonly userId: Maybe<Scalars['ID']>;
};

export type GQLThemeTotal = {
  readonly __typename?: 'ThemeTotal';
  readonly name: Scalars['String'];
  readonly total: Scalars['Int'];
  readonly totalCompleted: Scalars['Int'];
};

export type GQLUpdateUserRolesInput = {
  readonly isNewUser: Scalars['Boolean'];
  readonly userId: Scalars['String'];
  readonly roleIds: Maybe<ReadonlyArray<Scalars['ID']>>;
};

export type GQLUserRolesQueryInput = {
  readonly userId: Maybe<Scalars['ID']>;
  readonly roleIds: Maybe<ReadonlyArray<Scalars['ID']>>;
};

export type GQLUserQueryInput = {
  readonly userId: Maybe<Scalars['ID']>;
  readonly roleIds: Maybe<ReadonlyArray<Scalars['ID']>>;
};

export type GQLActivityData = {
  readonly activityId: Scalars['ID'];
};

export type GQLActivityTimer = {
  readonly __typename?: 'ActivityTimer';
  readonly id: Scalars['ID'];
  readonly userId: Scalars['ID'];
  readonly cycleActivityId: Scalars['ID'];
  readonly startTime: Scalars['DateTime'];
  readonly completionTime: Maybe<Scalars['DateTime']>;
  readonly completed: Scalars['Boolean'];
  readonly classId: Scalars['ID'];
  readonly cycleActivity: GQLCycleActivity;
  readonly currentUser: GQLUser;
};

export type GQLEmbeddedActivityData = GQLActivityData & {
  readonly __typename?: 'EmbeddedActivityData';
  readonly activityId: Scalars['ID'];
  readonly url: Scalars['String'];
  readonly height: Scalars['Int'];
};

export type GQLHtmlActivityData = GQLActivityData & {
  readonly __typename?: 'HtmlActivityData';
  readonly activityId: Scalars['ID'];
  readonly html: Scalars['String'];
};

export type GQLActivity = {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly typeId: ActivityTypeId;
  readonly type: GQLActivityType;
  readonly active: Scalars['Boolean'];
  readonly estimatedTime: Scalars['String'];
};

export type GQLAnnotation = {
  readonly __typename?: 'Annotation';
  readonly id: Scalars['ID'];
  readonly userId: Scalars['String'];
  readonly meetingId: Maybe<Scalars['String']>;
  readonly createdDate: Scalars['String'];
  readonly updatedDate: Scalars['String'];
  readonly data: Scalars['String'];
};

export type GQLAvatar = {
  readonly __typename?: 'Avatar';
  readonly id: Scalars['ID'];
  readonly name: Scalars['ID'];
  readonly extension: Scalars['String'];
  readonly thumbnailUrl: Scalars['String'];
  readonly listUrl: Scalars['String'];
};

export type GQLBackup = {
  readonly __typename?: 'Backup';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly type: Maybe<Scalars['String']>;
  readonly data: Scalars['String'];
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
};

export type GQLCampus = {
  readonly __typename?: 'Campus';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly regionalId: Maybe<Scalars['ID']>;
};

export type GQLCarrer = {
  readonly __typename?: 'Carrer';
  readonly id: Scalars['ID'];
  readonly carrerId: Scalars['String'];
  readonly active: Scalars['Boolean'];
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
  readonly permissions: Maybe<ReadonlyArray<Maybe<GQLCarrerPermission>>>;
};

export type GQLChallenge = {
  readonly __typename?: 'Challenge';
  readonly id: Scalars['ID'];
  readonly text: Scalars['String'];
  readonly startAt: Scalars['DateTime'];
  readonly endAt: Scalars['DateTime'];
  readonly active: Scalars['Boolean'];
};

export type GQLChatMessage = {
  readonly __typename?: 'ChatMessage';
  readonly id: Scalars['ID'];
  readonly userId: Scalars['String'];
  readonly isEtutor: Maybe<Scalars['Boolean']>;
  readonly levelCodeId: Maybe<Scalars['String']>;
  readonly levelCodeName: Maybe<Scalars['String']>;
  readonly levelThemeId: Maybe<Scalars['String']>;
  readonly levelThemeName: Maybe<Scalars['String']>;
  readonly cycleActivityId: Maybe<Scalars['String']>;
  readonly cycleActivityName: Maybe<Scalars['String']>;
  readonly activityName: Maybe<Scalars['String']>;
  readonly message: Scalars['String'];
  readonly updatedAt: Scalars['DateTime'];
  readonly createdAt: Scalars['DateTime'];
  readonly user: GQLUser;
};

export type GQLChat = {
  readonly __typename?: 'Chat';
  readonly userId: Scalars['ID'];
  readonly firstMessage: Scalars['String'];
  readonly dateMessage: Scalars['String'];
  readonly amountMessage: Maybe<Scalars['Int']>;
  readonly isRead: Maybe<Scalars['Boolean']>;
  readonly updatedAt: Scalars['DateTime'];
  readonly createdAt: Scalars['DateTime'];
  readonly user: GQLUser;
  readonly levelCode: ReadonlyArray<Maybe<GQLLevelCode>>;
};

export type GQLActivityComment = GQLComment & {
  readonly __typename?: 'ActivityComment';
  readonly id: Scalars['ID'];
  readonly text: Scalars['String'];
  readonly userId: Scalars['ID'];
  readonly parentId: Maybe<Scalars['ID']>;
  readonly activityId: Scalars['ID'];
  readonly classId: Scalars['ID'];
  readonly replies: ReadonlyArray<GQLActivityComment>;
  readonly user: GQLUser;
  readonly createdAt: Scalars['DateTime'];
  readonly viewerCanDelete: Scalars['Boolean'];
  readonly viewerCanEdit: Scalars['Boolean'];
  readonly parent: Maybe<GQLActivityComment>;
};

export type GQLComment = {
  readonly id: Scalars['ID'];
  readonly text: Scalars['String'];
  readonly userId: Scalars['ID'];
  readonly parentId: Maybe<Scalars['ID']>;
  readonly createdAt: Scalars['DateTime'];
};

export type GQLCount = {
  readonly __typename?: 'Count';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly count: Maybe<Scalars['Int']>;
};

export type GQLCycleActivity = {
  readonly __typename?: 'CycleActivity';
  readonly id: Scalars['ID'];
  readonly cycleId: Scalars['ID'];
  readonly activityId: Scalars['ID'];
  readonly order: Scalars['Int'];
  readonly cycle: GQLCycle;
  readonly activity: GQLActivityUnion;
  readonly nextActivity: Maybe<GQLCycleActivity>;
  readonly previousActivity: Maybe<GQLCycleActivity>;
  readonly viewerHasCompleted: Scalars['Boolean'];
  readonly studentHasCompleted: Scalars['Boolean'];
};


export type GQLCycleActivitystudentHasCompletedArgs = {
  studentId: Scalars['ID'];
};

export type GQLEnrollmentClass = {
  readonly __typename?: 'EnrollmentClass';
  readonly id: Scalars['ID'];
  readonly enrollmentId: Scalars['ID'];
  readonly classId: Scalars['ID'];
  readonly class: GQLClass;
};

export type GQLEnrollment = {
  readonly __typename?: 'Enrollment';
  readonly id: Scalars['ID'];
  readonly userId: Scalars['ID'];
  readonly levelCodeId: Scalars['ID'];
  readonly levelCode: GQLLevelCode;
};

export type GQLInterest = {
  readonly __typename?: 'Interest';
  readonly id: Scalars['ID'];
  readonly name: Scalars['ID'];
};

export type GQLLevelCode = {
  readonly __typename?: 'LevelCode';
  readonly id: Scalars['ID'];
  readonly code: Scalars['ID'];
  readonly description: Maybe<Scalars['String']>;
  readonly active: Scalars['Boolean'];
  readonly createdAt: Scalars['DateTime'];
  readonly levelId: Maybe<Scalars['ID']>;
  readonly level: Maybe<GQLLevel>;
  readonly learningMore: Maybe<Scalars['String']>;
  readonly viewerTeacherClasses: ReadonlyArray<GQLTeacherClass>;
  readonly viewerClasses: ReadonlyArray<GQLClass>;
};


export type GQLLevelCodeviewerTeacherClassesArgs = {
  filters: Maybe<GQLLevelCodeViewTeacherClassFilterInput>;
};


export type GQLLevelCodeviewerClassesArgs = {
  filters: Maybe<GQLLevelCodeViewClassFilterInput>;
};

export type GQLLevelCodeViewTeacherClassFilterInput = {
  readonly active: Maybe<Scalars['Boolean']>;
  readonly userId: Maybe<Scalars['ID']>;
};

export type GQLLevelCodeViewClassFilterInput = {
  readonly last30days: Maybe<Scalars['Boolean']>;
  readonly userId: Maybe<Scalars['ID']>;
};

export type GQLLevel = {
  readonly __typename?: 'Level';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly order: Scalars['Int'];
  readonly active: Scalars['Boolean'];
  readonly typeId: LevelTypeId;
  readonly levelThemes: ReadonlyArray<GQLLevelTheme>;
  readonly codes: ReadonlyArray<GQLLevelCode>;
  readonly viewerClasses: ReadonlyArray<GQLEnrollmentClass>;
  readonly totalActivities: Scalars['Int'];
  readonly viewerTotalCompletedActivities: Scalars['Int'];
  readonly viewerNextUnfinishedActivity: Maybe<GQLCycleActivity>;
};

export type GQLLocal = {
  readonly __typename?: 'Local';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly campusId: Maybe<Scalars['ID']>;
};

export type GQLLog = {
  readonly __typename?: 'Log';
  readonly id: Scalars['ID'];
  readonly body: Maybe<Scalars['String']>;
  readonly key: Maybe<Scalars['String']>;
  readonly createdAt: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
};

export type GQLMaterial = {
  readonly __typename?: 'Material';
  readonly id: Scalars['String'];
  readonly userId: Scalars['String'];
  readonly classId: Scalars['String'];
  readonly isbn: Scalars['String'];
  readonly author: Scalars['String'];
  readonly title: Scalars['String'];
  readonly publisher: Scalars['String'];
  readonly coverImg: Scalars['String'];
  readonly isInternal: Scalars['Boolean'];
  readonly acquiredLanguageBooster: Scalars['Boolean'];
  readonly languageBank: Scalars['Boolean'];
  readonly active: Scalars['Boolean'];
  readonly contextId: Scalars['String'];
  readonly createdAt: Scalars['String'];
  readonly updatedAt: Scalars['String'];
  readonly materialClass: GQLClass;
};

export type GQLMeeting = {
  readonly __typename?: 'Meeting';
  readonly id: Scalars['ID'];
  readonly date: Maybe<Scalars['String']>;
  readonly objetive: Maybe<Scalars['String']>;
  readonly startHour: Maybe<Scalars['String']>;
  readonly endHour: Maybe<Scalars['String']>;
  readonly classId: Scalars['ID'];
  readonly attendTmpltNbr: Maybe<Scalars['String']>;
  readonly facilityId: Maybe<Scalars['String']>;
  readonly enabled: Maybe<Scalars['Boolean']>;
  readonly teacherName: Maybe<Scalars['String']>;
  readonly courseName: Maybe<Scalars['String']>;
  readonly teacherNotes: Maybe<Scalars['String']>;
  readonly homework: Maybe<Scalars['String']>;
};

export type GQLNewsletter = {
  readonly __typename?: 'Newsletter';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly imgSrc: Scalars['String'];
  readonly linkUrl: Scalars['String'];
  readonly active: Scalars['Boolean'];
};

export type GQLCarrerPermission = {
  readonly __typename?: 'CarrerPermission';
  readonly id: Scalars['ID'];
  readonly carrerId: Scalars['String'];
  readonly carrer: Scalars['String'];
  readonly name: Maybe<Scalars['String']>;
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
  readonly active: Maybe<Scalars['Boolean']>;
};

export type GQLRegional = {
  readonly __typename?: 'Regional';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
};

export type GQLTeacherClass = {
  readonly __typename?: 'TeacherClass';
  readonly id: Scalars['ID'];
  readonly teacherId: Scalars['ID'];
  readonly classId: Scalars['ID'];
  readonly class: GQLClass;
  readonly teacher: GQLUser;
};

export type GQLThemeIcon = {
  readonly __typename?: 'ThemeIcon';
  readonly themeId: Scalars['ID'];
  readonly content: Scalars['String'];
};

export type GQLTheme = {
  readonly __typename?: 'Theme';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly active: Scalars['Boolean'];
  readonly startColor: Scalars['String'];
  readonly endColor: Scalars['String'];
  readonly icon: GQLThemeIcon;
};

export type GQLUserInterest = {
  readonly __typename?: 'UserInterest';
  readonly id: Scalars['ID'];
  readonly order: Scalars['Int'];
  readonly interestId: Scalars['ID'];
  readonly userId: Scalars['ID'];
  readonly interest: GQLInterest;
};

export type GQLUserRole = {
  readonly __typename?: 'UserRole';
  readonly id: Scalars['ID'];
  readonly userId: Scalars['ID'];
  readonly roleId: RoleId;
  readonly user: GQLUser;
  readonly role: GQLRole;
};

export type GQLstudentLevel = {
  readonly __typename?: 'studentLevel';
  readonly totalCompletedActivities: Scalars['Int'];
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
  ActivityTypeId: ActivityTypeId;
  GradeTypeId: GradeTypeId;
  LevelTypeId: LevelTypeId;
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CreateEmbeddedActivityInput: GQLCreateEmbeddedActivityInput;
  CreateHtmlActivityInput: GQLCreateHtmlActivityInput;
  EmbeddedActivityDataInput: GQLEmbeddedActivityDataInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  HtmlActivityDataInput: GQLHtmlActivityDataInput;
  UpdateEmbeddedActivityInput: GQLUpdateEmbeddedActivityInput;
  CompleteActivityInput: GQLCompleteActivityInput;
  CompleteActivityResult: GQLResolversTypes['ActivityTimer'] | GQLResolversTypes['SimpleError'];
  CreateCommentOnActivityInput: GQLCreateCommentOnActivityInput;
  CreateCommentOnActivityResult: GQLResolversTypes['ActivityComment'] | GQLResolversTypes['SimpleError'];
  UpdateCycleActivitiesOrderInput: GQLUpdateCycleActivitiesOrderInput;
  CreateCycleInput: GQLCreateCycleInput;
  UpdateCycleInput: GQLUpdateCycleInput;
  AddActivitiesToCycleItemsInput: GQLAddActivitiesToCycleItemsInput;
  AddActivitiesToCycleInput: GQLAddActivitiesToCycleInput;
  UpdateCyclesOrderInput: GQLUpdateCyclesOrderInput;
  DeleteActivityCommentInput: GQLDeleteActivityCommentInput;
  DeleteActivityCommentSuccessResult: ResolverTypeWrapper<DeleteActivityCommentSuccessResult>;
  DeleteActivityCommentResult: GQLResolversTypes['DeleteActivityCommentSuccessResult'] | GQLResolversTypes['SimpleError'];
  UpdateLevelThemesOrderInput: GQLUpdateLevelThemesOrderInput;
  CreateLevelCodeInput: GQLCreateLevelCodeInput;
  CreateLevelInput: GQLCreateLevelInput;
  AddThemesToLevelItemsInput: GQLAddThemesToLevelItemsInput;
  AddThemesToLevelInput: GQLAddThemesToLevelInput;
  UpdateBasicLevelInfoInput: GQLUpdateBasicLevelInfoInput;
  StartActivityInput: GQLStartActivityInput;
  StartActivityResult: GQLResolversTypes['ActivityTimer'] | GQLResolversTypes['SimpleError'];
  CreateThemeInput: GQLCreateThemeInput;
  IconDataInput: GQLIconDataInput;
  UpdateThemeInput: GQLUpdateThemeInput;
  Query: ResolverTypeWrapper<{}>;
  ActivitiesListByProgressOrder: ResolverTypeWrapper<GQLActivitiesListByProgressOrder>;
  ActivityCommentsQueryInput: GQLActivityCommentsQueryInput;
  LevelThemesQueryInput: GQLLevelThemesQueryInput;
  AvailableThemesInputData: GQLAvailableThemesInputData;
  Class: ResolverTypeWrapper<ClassEntity>;
  ClassStudentGradesInput: GQLClassStudentGradesInput;
  User: ResolverTypeWrapper<UserEntity>;
  ActivityType: ResolverTypeWrapper<ActivityType>;
  EmbeddedActivity: ResolverTypeWrapper<ActivityEntity>;
  HtmlActivity: ResolverTypeWrapper<ActivityEntity>;
  ActivityUnion: ResolverTypeWrapper<ActivityEntity>;
  ClassStudentGrade: ResolverTypeWrapper<ClassStudentGrade>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  StudentGrade: ResolverTypeWrapper<StudentGrade>;
  AnnotationUpsertInput: GQLAnnotationUpsertInput;
  PermissionId: PermissionId;
  RoleId: RoleId;
  Permission: ResolverTypeWrapper<Permission>;
  Role: ResolverTypeWrapper<Role>;
  ViewerChangeAvatarInput: GQLViewerChangeAvatarInput;
  ViewerChangeAvatarMutationError: ResolverTypeWrapper<GQLViewerChangeAvatarMutationError>;
  ViewerChangeAvatarMutationResult: GQLResolversTypes['User'] | GQLResolversTypes['ViewerChangeAvatarMutationError'];
  CreateChallengeInput: GQLCreateChallengeInput;
  UpdateChallengeInput: GQLUpdateChallengeInput;
  InsertChatInput: GQLInsertChatInput;
  ChatStudentsQueryInput: GQLChatStudentsQueryInput;
  ClassesQueryInput: GQLClassesQueryInput;
  countQueryInput: GQLcountQueryInput;
  ViewerEnrollmenLevelCodestFilterInput: GQLViewerEnrollmenLevelCodestFilterInput;
  UpsertUserInterestInput: GQLUpsertUserInterestInput;
  InterestPaginationData: GQLInterestPaginationData;
  learningMoreOptionsInput: GQLlearningMoreOptionsInput;
  AuditInput: GQLAuditInput;
  LogsQueryInput: GQLLogsQueryInput;
  OccResult: ResolverTypeWrapper<GQLOccResult>;
  CreateNewsletterInput: GQLCreateNewsletterInput;
  UpdateNewsletterInput: GQLUpdateNewsletterInput;
  Cycle: ResolverTypeWrapper<CycleEntity>;
  LevelTheme: ResolverTypeWrapper<LevelThemeEntity>;
  ClassStudentsQueryInput: GQLClassStudentsQueryInput;
  OverallClassCompletedActivities: ResolverTypeWrapper<GQLOverallClassCompletedActivities>;
  ProgressStudent: ResolverTypeWrapper<GQLProgressStudent>;
  ProgressStudentsQueryInput: GQLProgressStudentsQueryInput;
  LevelCodeItem: ResolverTypeWrapper<GQLLevelCodeItem>;
  ClassItem: ResolverTypeWrapper<GQLClassItem>;
  TeacherClassesActivated: ResolverTypeWrapper<GQLTeacherClassesActivated>;
  TeacherClassesQueryInput: GQLTeacherClassesQueryInput;
  ViewerTeacherLevelCodesFilterInput: GQLViewerTeacherLevelCodesFilterInput;
  ThemeTotal: ResolverTypeWrapper<GQLThemeTotal>;
  UpdateUserRolesInput: GQLUpdateUserRolesInput;
  UserRolesQueryInput: GQLUserRolesQueryInput;
  UserQueryInput: GQLUserQueryInput;
  ActivityData: GQLResolversTypes['EmbeddedActivityData'] | GQLResolversTypes['HtmlActivityData'];
  ActivityTimer: ResolverTypeWrapper<ActivityTimerEntity>;
  EmbeddedActivityData: ResolverTypeWrapper<EmbeddedActivityDataEntity>;
  HtmlActivityData: ResolverTypeWrapper<HtmlActivityDataEntity>;
  Activity: GQLResolversTypes['EmbeddedActivity'] | GQLResolversTypes['HtmlActivity'];
  Annotation: ResolverTypeWrapper<GQLAnnotation>;
  Avatar: ResolverTypeWrapper<AvatarEntity>;
  Backup: ResolverTypeWrapper<GQLBackup>;
  Campus: ResolverTypeWrapper<GQLCampus>;
  Carrer: ResolverTypeWrapper<GQLCarrer>;
  Challenge: ResolverTypeWrapper<ChallengeEntity>;
  ChatMessage: ResolverTypeWrapper<ChatMessageEntity>;
  Chat: ResolverTypeWrapper<ChatEntity>;
  ActivityComment: ResolverTypeWrapper<ActivityCommentEntity>;
  Comment: GQLResolversTypes['ActivityComment'];
  Count: ResolverTypeWrapper<GQLCount>;
  CycleActivity: ResolverTypeWrapper<CycleActivityEntity>;
  EnrollmentClass: ResolverTypeWrapper<EnrollmentClassEntity>;
  Enrollment: ResolverTypeWrapper<EnrollmentEntity>;
  Interest: ResolverTypeWrapper<GQLInterest>;
  LevelCode: ResolverTypeWrapper<LevelCodeEntity>;
  LevelCodeViewTeacherClassFilterInput: GQLLevelCodeViewTeacherClassFilterInput;
  LevelCodeViewClassFilterInput: GQLLevelCodeViewClassFilterInput;
  Level: ResolverTypeWrapper<LevelEntity>;
  Local: ResolverTypeWrapper<GQLLocal>;
  Log: ResolverTypeWrapper<GQLLog>;
  Material: ResolverTypeWrapper<Omit<GQLMaterial, 'materialClass'> & { materialClass: GQLResolversTypes['Class'] }>;
  Meeting: ResolverTypeWrapper<GQLMeeting>;
  Newsletter: ResolverTypeWrapper<GQLNewsletter>;
  CarrerPermission: ResolverTypeWrapper<GQLCarrerPermission>;
  Regional: ResolverTypeWrapper<GQLRegional>;
  TeacherClass: ResolverTypeWrapper<TeacherClassEntity>;
  ThemeIcon: ResolverTypeWrapper<ThemeIconEntity>;
  Theme: ResolverTypeWrapper<ThemeEntity>;
  UserInterest: ResolverTypeWrapper<GQLUserInterest>;
  UserRole: ResolverTypeWrapper<UserRoleEntity>;
  studentLevel: ResolverTypeWrapper<GQLstudentLevel>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  GenericError: ResolverTypeWrapper<GenericError>;
  SimpleError: ResolverTypeWrapper<SimpleError>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = {
  Mutation: {};
  ID: Scalars['ID'];
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  CreateEmbeddedActivityInput: GQLCreateEmbeddedActivityInput;
  CreateHtmlActivityInput: GQLCreateHtmlActivityInput;
  EmbeddedActivityDataInput: GQLEmbeddedActivityDataInput;
  Int: Scalars['Int'];
  HtmlActivityDataInput: GQLHtmlActivityDataInput;
  UpdateEmbeddedActivityInput: GQLUpdateEmbeddedActivityInput;
  CompleteActivityInput: GQLCompleteActivityInput;
  CompleteActivityResult: GQLResolversParentTypes['ActivityTimer'] | GQLResolversParentTypes['SimpleError'];
  CreateCommentOnActivityInput: GQLCreateCommentOnActivityInput;
  CreateCommentOnActivityResult: GQLResolversParentTypes['ActivityComment'] | GQLResolversParentTypes['SimpleError'];
  UpdateCycleActivitiesOrderInput: GQLUpdateCycleActivitiesOrderInput;
  CreateCycleInput: GQLCreateCycleInput;
  UpdateCycleInput: GQLUpdateCycleInput;
  AddActivitiesToCycleItemsInput: GQLAddActivitiesToCycleItemsInput;
  AddActivitiesToCycleInput: GQLAddActivitiesToCycleInput;
  UpdateCyclesOrderInput: GQLUpdateCyclesOrderInput;
  DeleteActivityCommentInput: GQLDeleteActivityCommentInput;
  DeleteActivityCommentSuccessResult: DeleteActivityCommentSuccessResult;
  DeleteActivityCommentResult: GQLResolversParentTypes['DeleteActivityCommentSuccessResult'] | GQLResolversParentTypes['SimpleError'];
  UpdateLevelThemesOrderInput: GQLUpdateLevelThemesOrderInput;
  CreateLevelCodeInput: GQLCreateLevelCodeInput;
  CreateLevelInput: GQLCreateLevelInput;
  AddThemesToLevelItemsInput: GQLAddThemesToLevelItemsInput;
  AddThemesToLevelInput: GQLAddThemesToLevelInput;
  UpdateBasicLevelInfoInput: GQLUpdateBasicLevelInfoInput;
  StartActivityInput: GQLStartActivityInput;
  StartActivityResult: GQLResolversParentTypes['ActivityTimer'] | GQLResolversParentTypes['SimpleError'];
  CreateThemeInput: GQLCreateThemeInput;
  IconDataInput: GQLIconDataInput;
  UpdateThemeInput: GQLUpdateThemeInput;
  Query: {};
  ActivitiesListByProgressOrder: GQLActivitiesListByProgressOrder;
  ActivityCommentsQueryInput: GQLActivityCommentsQueryInput;
  LevelThemesQueryInput: GQLLevelThemesQueryInput;
  AvailableThemesInputData: GQLAvailableThemesInputData;
  Class: ClassEntity;
  ClassStudentGradesInput: GQLClassStudentGradesInput;
  User: UserEntity;
  ActivityType: ActivityType;
  EmbeddedActivity: ActivityEntity;
  HtmlActivity: ActivityEntity;
  ActivityUnion: ActivityEntity;
  ClassStudentGrade: ClassStudentGrade;
  Float: Scalars['Float'];
  StudentGrade: StudentGrade;
  AnnotationUpsertInput: GQLAnnotationUpsertInput;
  Permission: Permission;
  Role: Role;
  ViewerChangeAvatarInput: GQLViewerChangeAvatarInput;
  ViewerChangeAvatarMutationError: GQLViewerChangeAvatarMutationError;
  ViewerChangeAvatarMutationResult: GQLResolversParentTypes['User'] | GQLResolversParentTypes['ViewerChangeAvatarMutationError'];
  CreateChallengeInput: GQLCreateChallengeInput;
  UpdateChallengeInput: GQLUpdateChallengeInput;
  InsertChatInput: GQLInsertChatInput;
  ChatStudentsQueryInput: GQLChatStudentsQueryInput;
  ClassesQueryInput: GQLClassesQueryInput;
  countQueryInput: GQLcountQueryInput;
  ViewerEnrollmenLevelCodestFilterInput: GQLViewerEnrollmenLevelCodestFilterInput;
  UpsertUserInterestInput: GQLUpsertUserInterestInput;
  InterestPaginationData: GQLInterestPaginationData;
  learningMoreOptionsInput: GQLlearningMoreOptionsInput;
  AuditInput: GQLAuditInput;
  LogsQueryInput: GQLLogsQueryInput;
  OccResult: GQLOccResult;
  CreateNewsletterInput: GQLCreateNewsletterInput;
  UpdateNewsletterInput: GQLUpdateNewsletterInput;
  Cycle: CycleEntity;
  LevelTheme: LevelThemeEntity;
  ClassStudentsQueryInput: GQLClassStudentsQueryInput;
  OverallClassCompletedActivities: GQLOverallClassCompletedActivities;
  ProgressStudent: GQLProgressStudent;
  ProgressStudentsQueryInput: GQLProgressStudentsQueryInput;
  LevelCodeItem: GQLLevelCodeItem;
  ClassItem: GQLClassItem;
  TeacherClassesActivated: GQLTeacherClassesActivated;
  TeacherClassesQueryInput: GQLTeacherClassesQueryInput;
  ViewerTeacherLevelCodesFilterInput: GQLViewerTeacherLevelCodesFilterInput;
  ThemeTotal: GQLThemeTotal;
  UpdateUserRolesInput: GQLUpdateUserRolesInput;
  UserRolesQueryInput: GQLUserRolesQueryInput;
  UserQueryInput: GQLUserQueryInput;
  ActivityData: GQLResolversParentTypes['EmbeddedActivityData'] | GQLResolversParentTypes['HtmlActivityData'];
  ActivityTimer: ActivityTimerEntity;
  EmbeddedActivityData: EmbeddedActivityDataEntity;
  HtmlActivityData: HtmlActivityDataEntity;
  Activity: GQLResolversParentTypes['EmbeddedActivity'] | GQLResolversParentTypes['HtmlActivity'];
  Annotation: GQLAnnotation;
  Avatar: AvatarEntity;
  Backup: GQLBackup;
  Campus: GQLCampus;
  Carrer: GQLCarrer;
  Challenge: ChallengeEntity;
  ChatMessage: ChatMessageEntity;
  Chat: ChatEntity;
  ActivityComment: ActivityCommentEntity;
  Comment: GQLResolversParentTypes['ActivityComment'];
  Count: GQLCount;
  CycleActivity: CycleActivityEntity;
  EnrollmentClass: EnrollmentClassEntity;
  Enrollment: EnrollmentEntity;
  Interest: GQLInterest;
  LevelCode: LevelCodeEntity;
  LevelCodeViewTeacherClassFilterInput: GQLLevelCodeViewTeacherClassFilterInput;
  LevelCodeViewClassFilterInput: GQLLevelCodeViewClassFilterInput;
  Level: LevelEntity;
  Local: GQLLocal;
  Log: GQLLog;
  Material: Omit<GQLMaterial, 'materialClass'> & { materialClass: GQLResolversParentTypes['Class'] };
  Meeting: GQLMeeting;
  Newsletter: GQLNewsletter;
  CarrerPermission: GQLCarrerPermission;
  Regional: GQLRegional;
  TeacherClass: TeacherClassEntity;
  ThemeIcon: ThemeIconEntity;
  Theme: ThemeEntity;
  UserInterest: GQLUserInterest;
  UserRole: UserRoleEntity;
  studentLevel: GQLstudentLevel;
  DateTime: Scalars['DateTime'];
  GenericError: GenericError;
  SimpleError: SimpleError;
};

export type GQLActivityTypeIdResolvers = EnumResolverSignature<{ EMBEDDED: any, HTML: any }, GQLResolversTypes['ActivityTypeId']>;

export type GQLGradeTypeIdResolvers = EnumResolverSignature<{ VIEW: any, COMPLETION: any }, GQLResolversTypes['GradeTypeId']>;

export type GQLLevelTypeIdResolvers = EnumResolverSignature<{ ADULT: any, YOUNG: any }, GQLResolversTypes['LevelTypeId']>;

export type GQLMutationResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Mutation'] = GQLResolversParentTypes['Mutation']> = {
  activateActivity: Resolver<GQLResolversTypes['ActivityUnion'], ParentType, ContextType, RequireFields<GQLMutationactivateActivityArgs, 'id'>>;
  activateChallenge: Resolver<Maybe<GQLResolversTypes['Challenge']>, ParentType, ContextType, RequireFields<GQLMutationactivateChallengeArgs, 'id'>>;
  activateCycle: Resolver<GQLResolversTypes['Cycle'], ParentType, ContextType, RequireFields<GQLMutationactivateCycleArgs, 'id'>>;
  activateLevel: Resolver<GQLResolversTypes['Level'], ParentType, ContextType, RequireFields<GQLMutationactivateLevelArgs, 'id'>>;
  activateNewsletter: Resolver<Maybe<GQLResolversTypes['Newsletter']>, ParentType, ContextType, RequireFields<GQLMutationactivateNewsletterArgs, 'id'>>;
  activateTheme: Resolver<Maybe<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLMutationactivateThemeArgs, 'id'>>;
  addActivitiesToCycle: Resolver<GQLResolversTypes['Cycle'], ParentType, ContextType, RequireFields<GQLMutationaddActivitiesToCycleArgs, 'data'>>;
  addThemesToLevel: Resolver<GQLResolversTypes['Level'], ParentType, ContextType, RequireFields<GQLMutationaddThemesToLevelArgs, 'data'>>;
  audit: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<GQLMutationauditArgs, 'data'>>;
  chatMakeRead: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  completeActivity: Resolver<GQLResolversTypes['CompleteActivityResult'], ParentType, ContextType, RequireFields<GQLMutationcompleteActivityArgs, 'data'>>;
  createChallenge: Resolver<GQLResolversTypes['Challenge'], ParentType, ContextType, RequireFields<GQLMutationcreateChallengeArgs, 'data'>>;
  createCommentOnActivity: Resolver<GQLResolversTypes['CreateCommentOnActivityResult'], ParentType, ContextType, RequireFields<GQLMutationcreateCommentOnActivityArgs, 'data'>>;
  createCycle: Resolver<GQLResolversTypes['Cycle'], ParentType, ContextType, RequireFields<GQLMutationcreateCycleArgs, 'data'>>;
  createEmbeddedActivity: Resolver<GQLResolversTypes['EmbeddedActivity'], ParentType, ContextType, RequireFields<GQLMutationcreateEmbeddedActivityArgs, 'data'>>;
  createHtmlActivity: Resolver<GQLResolversTypes['HtmlActivity'], ParentType, ContextType, RequireFields<GQLMutationcreateHtmlActivityArgs, 'data'>>;
  createLevel: Resolver<GQLResolversTypes['Level'], ParentType, ContextType, RequireFields<GQLMutationcreateLevelArgs, 'data'>>;
  createLevelCode: Resolver<GQLResolversTypes['LevelCode'], ParentType, ContextType, RequireFields<GQLMutationcreateLevelCodeArgs, 'data'>>;
  createNewsletter: Resolver<GQLResolversTypes['Newsletter'], ParentType, ContextType, RequireFields<GQLMutationcreateNewsletterArgs, 'data'>>;
  createTheme: Resolver<GQLResolversTypes['Theme'], ParentType, ContextType, RequireFields<GQLMutationcreateThemeArgs, 'data'>>;
  deactivateActivity: Resolver<GQLResolversTypes['ActivityUnion'], ParentType, ContextType, RequireFields<GQLMutationdeactivateActivityArgs, 'id'>>;
  deactivateChallenge: Resolver<Maybe<GQLResolversTypes['Challenge']>, ParentType, ContextType, RequireFields<GQLMutationdeactivateChallengeArgs, 'id'>>;
  deactivateCycle: Resolver<GQLResolversTypes['Cycle'], ParentType, ContextType, RequireFields<GQLMutationdeactivateCycleArgs, 'id'>>;
  deactivateLevel: Resolver<GQLResolversTypes['Level'], ParentType, ContextType, RequireFields<GQLMutationdeactivateLevelArgs, 'id'>>;
  deactivateNewsletter: Resolver<Maybe<GQLResolversTypes['Newsletter']>, ParentType, ContextType, RequireFields<GQLMutationdeactivateNewsletterArgs, 'id'>>;
  deactivateTheme: Resolver<Maybe<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLMutationdeactivateThemeArgs, 'id'>>;
  deleteActivityComment: Resolver<GQLResolversTypes['DeleteActivityCommentResult'], ParentType, ContextType, RequireFields<GQLMutationdeleteActivityCommentArgs, 'data'>>;
  deleteActivityFromCycle: Resolver<GQLResolversTypes['Cycle'], ParentType, ContextType, RequireFields<GQLMutationdeleteActivityFromCycleArgs, 'cycleActivityId'>>;
  deleteCycleFromLevelTheme: Resolver<GQLResolversTypes['LevelTheme'], ParentType, ContextType, RequireFields<GQLMutationdeleteCycleFromLevelThemeArgs, 'cycleId'>>;
  deleteThemeFromLevel: Resolver<GQLResolversTypes['Level'], ParentType, ContextType, RequireFields<GQLMutationdeleteThemeFromLevelArgs, 'levelThemeId'>>;
  finishOnboard: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  insertChat: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<GQLMutationinsertChatArgs, 'payload'>>;
  presence: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<GQLMutationpresenceArgs, 'turma'>>;
  startActivity: Resolver<GQLResolversTypes['StartActivityResult'], ParentType, ContextType, RequireFields<GQLMutationstartActivityArgs, 'data'>>;
  updateBasicLevelInfo: Resolver<GQLResolversTypes['Level'], ParentType, ContextType, RequireFields<GQLMutationupdateBasicLevelInfoArgs, 'data'>>;
  updateChallenge: Resolver<GQLResolversTypes['Challenge'], ParentType, ContextType, RequireFields<GQLMutationupdateChallengeArgs, 'data'>>;
  updateCycle: Resolver<GQLResolversTypes['Cycle'], ParentType, ContextType, RequireFields<GQLMutationupdateCycleArgs, 'data'>>;
  updateCycleActivitiesOrder: Resolver<ReadonlyArray<GQLResolversTypes['CycleActivity']>, ParentType, ContextType, RequireFields<GQLMutationupdateCycleActivitiesOrderArgs, 'data'>>;
  updateCyclesOrder: Resolver<ReadonlyArray<GQLResolversTypes['Cycle']>, ParentType, ContextType, RequireFields<GQLMutationupdateCyclesOrderArgs, 'data'>>;
  updateEmbeddedActivity: Resolver<GQLResolversTypes['EmbeddedActivity'], ParentType, ContextType, RequireFields<GQLMutationupdateEmbeddedActivityArgs, 'data'>>;
  updateLevelThemesOrder: Resolver<ReadonlyArray<GQLResolversTypes['LevelTheme']>, ParentType, ContextType, RequireFields<GQLMutationupdateLevelThemesOrderArgs, 'data'>>;
  updateNewsletter: Resolver<GQLResolversTypes['Newsletter'], ParentType, ContextType, RequireFields<GQLMutationupdateNewsletterArgs, 'data'>>;
  updateTheme: Resolver<GQLResolversTypes['Theme'], ParentType, ContextType, RequireFields<GQLMutationupdateThemeArgs, 'data'>>;
  updateUserRoles: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<GQLMutationupdateUserRolesArgs, 'data'>>;
  upsertAnnotation: Resolver<Maybe<GQLResolversTypes['Annotation']>, ParentType, ContextType, RequireFields<GQLMutationupsertAnnotationArgs, 'annotation'>>;
  upsertOrRemoveUserInterest: Resolver<Maybe<GQLResolversTypes['Interest']>, ParentType, ContextType, RequireFields<GQLMutationupsertOrRemoveUserInterestArgs, 'data'>>;
  viewerChangeAvatar: Resolver<GQLResolversTypes['ViewerChangeAvatarMutationResult'], ParentType, ContextType, RequireFields<GQLMutationviewerChangeAvatarArgs, 'data'>>;
};

export type GQLCompleteActivityResultResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['CompleteActivityResult'] = GQLResolversParentTypes['CompleteActivityResult']> = {
  __resolveType: TypeResolveFn<'ActivityTimer' | 'SimpleError', ParentType, ContextType>;
};

export type GQLCreateCommentOnActivityResultResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['CreateCommentOnActivityResult'] = GQLResolversParentTypes['CreateCommentOnActivityResult']> = {
  __resolveType: TypeResolveFn<'ActivityComment' | 'SimpleError', ParentType, ContextType>;
};

export type GQLDeleteActivityCommentSuccessResultResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['DeleteActivityCommentSuccessResult'] = GQLResolversParentTypes['DeleteActivityCommentSuccessResult']> = {
  success: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  activity: Resolver<GQLResolversTypes['ActivityUnion'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLDeleteActivityCommentResultResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['DeleteActivityCommentResult'] = GQLResolversParentTypes['DeleteActivityCommentResult']> = {
  __resolveType: TypeResolveFn<'DeleteActivityCommentSuccessResult' | 'SimpleError', ParentType, ContextType>;
};

export type GQLStartActivityResultResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['StartActivityResult'] = GQLResolversParentTypes['StartActivityResult']> = {
  __resolveType: TypeResolveFn<'ActivityTimer' | 'SimpleError', ParentType, ContextType>;
};

export type GQLQueryResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query']> = {
  Annotation: Resolver<Maybe<GQLResolversTypes['Annotation']>, ParentType, ContextType, RequireFields<GQLQueryAnnotationArgs, 'id'>>;
  Annotations: Resolver<ReadonlyArray<GQLResolversTypes['Annotation']>, ParentType, ContextType, RequireFields<GQLQueryAnnotationsArgs, never>>;
  Carrer: Resolver<Maybe<ReadonlyArray<Maybe<GQLResolversTypes['Carrer']>>>, ParentType, ContextType>;
  activeChallenge: Resolver<Maybe<GQLResolversTypes['Challenge']>, ParentType, ContextType>;
  activities: Resolver<ReadonlyArray<GQLResolversTypes['ActivityUnion']>, ParentType, ContextType>;
  activitiesListByProgressOrder: Resolver<ReadonlyArray<GQLResolversTypes['ActivitiesListByProgressOrder']>, ParentType, ContextType, RequireFields<GQLQueryactivitiesListByProgressOrderArgs, 'courseId'>>;
  activity: Resolver<Maybe<GQLResolversTypes['ActivityUnion']>, ParentType, ContextType, RequireFields<GQLQueryactivityArgs, 'id'>>;
  activityComments: Resolver<ReadonlyArray<GQLResolversTypes['ActivityComment']>, ParentType, ContextType, RequireFields<GQLQueryactivityCommentsArgs, 'data'>>;
  availableActivitiesForCycle: Resolver<ReadonlyArray<GQLResolversTypes['ActivityUnion']>, ParentType, ContextType, RequireFields<GQLQueryavailableActivitiesForCycleArgs, 'cycleId'>>;
  availableThemes: Resolver<ReadonlyArray<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLQueryavailableThemesArgs, 'availableThemesInputData'>>;
  avatars: Resolver<ReadonlyArray<GQLResolversTypes['Avatar']>, ParentType, ContextType>;
  backup: Resolver<Maybe<ReadonlyArray<Maybe<GQLResolversTypes['Backup']>>>, ParentType, ContextType, RequireFields<GQLQuerybackupArgs, 'id' | 'name' | 'withAutomatic'>>;
  challenge: Resolver<Maybe<GQLResolversTypes['Challenge']>, ParentType, ContextType, RequireFields<GQLQuerychallengeArgs, 'id'>>;
  challenges: Resolver<ReadonlyArray<GQLResolversTypes['Challenge']>, ParentType, ContextType>;
  chatHeader: Resolver<ReadonlyArray<GQLResolversTypes['Chat']>, ParentType, ContextType, RequireFields<GQLQuerychatHeaderArgs, 'userId'>>;
  chatMessage: Resolver<ReadonlyArray<Maybe<GQLResolversTypes['ChatMessage']>>, ParentType, ContextType, RequireFields<GQLQuerychatMessageArgs, never>>;
  chatNewMessages: Resolver<ReadonlyArray<Maybe<GQLResolversTypes['Chat']>>, ParentType, ContextType, RequireFields<GQLQuerychatNewMessagesArgs, 'userId'>>;
  chatNotifications: Resolver<ReadonlyArray<Maybe<GQLResolversTypes['Chat']>>, ParentType, ContextType>;
  chatStudents: Resolver<ReadonlyArray<GQLResolversTypes['Chat']>, ParentType, ContextType, RequireFields<GQLQuerychatStudentsArgs, never>>;
  class: Resolver<Maybe<GQLResolversTypes['Class']>, ParentType, ContextType, RequireFields<GQLQueryclassArgs, 'id'>>;
  classCycles: Resolver<ReadonlyArray<GQLResolversTypes['Cycle']>, ParentType, ContextType, RequireFields<GQLQueryclassCyclesArgs, 'classId'>>;
  classLevelThemes: Resolver<ReadonlyArray<GQLResolversTypes['LevelTheme']>, ParentType, ContextType, RequireFields<GQLQueryclassLevelThemesArgs, 'classId'>>;
  classStudents: Resolver<ReadonlyArray<GQLResolversTypes['User']>, ParentType, ContextType, RequireFields<GQLQueryclassStudentsArgs, 'data'>>;
  classes: Resolver<ReadonlyArray<GQLResolversTypes['Class']>, ParentType, ContextType, RequireFields<GQLQueryclassesArgs, never>>;
  count: Resolver<ReadonlyArray<GQLResolversTypes['Count']>, ParentType, ContextType, RequireFields<GQLQuerycountArgs, never>>;
  currentUser: Resolver<Maybe<GQLResolversTypes['User']>, ParentType, ContextType>;
  cycle: Resolver<Maybe<GQLResolversTypes['Cycle']>, ParentType, ContextType, RequireFields<GQLQuerycycleArgs, 'id'>>;
  cycleActivities: Resolver<ReadonlyArray<GQLResolversTypes['CycleActivity']>, ParentType, ContextType>;
  cycleActivity: Resolver<Maybe<GQLResolversTypes['CycleActivity']>, ParentType, ContextType, RequireFields<GQLQuerycycleActivityArgs, 'id'>>;
  cycles: Resolver<ReadonlyArray<GQLResolversTypes['Cycle']>, ParentType, ContextType>;
  getServiceNow: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  getZoom: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType, RequireFields<GQLQuerygetZoomArgs, 'classId'>>;
  icons: Resolver<ReadonlyArray<GQLResolversTypes['ThemeIcon']>, ParentType, ContextType>;
  interest: Resolver<ReadonlyArray<GQLResolversTypes['Interest']>, ParentType, ContextType, RequireFields<GQLQueryinterestArgs, 'filters'>>;
  learningMoreOption: Resolver<Maybe<GQLResolversTypes['LevelCode']>, ParentType, ContextType, RequireFields<GQLQuerylearningMoreOptionArgs, 'filters'>>;
  level: Resolver<Maybe<GQLResolversTypes['Level']>, ParentType, ContextType, RequireFields<GQLQuerylevelArgs, 'id'>>;
  levelCodes: Resolver<ReadonlyArray<GQLResolversTypes['LevelCode']>, ParentType, ContextType>;
  levelTheme: Resolver<Maybe<GQLResolversTypes['LevelTheme']>, ParentType, ContextType, RequireFields<GQLQuerylevelThemeArgs, 'id'>>;
  levelThemes: Resolver<ReadonlyArray<GQLResolversTypes['LevelTheme']>, ParentType, ContextType, RequireFields<GQLQuerylevelThemesArgs, 'data'>>;
  levels: Resolver<ReadonlyArray<GQLResolversTypes['Level']>, ParentType, ContextType>;
  logs: Resolver<ReadonlyArray<GQLResolversTypes['Log']>, ParentType, ContextType, RequireFields<GQLQuerylogsArgs, never>>;
  meet: Resolver<Maybe<GQLResolversTypes['Meeting']>, ParentType, ContextType, RequireFields<GQLQuerymeetArgs, 'id'>>;
  myEnrollments: Resolver<ReadonlyArray<GQLResolversTypes['Enrollment']>, ParentType, ContextType>;
  myLevels: Resolver<ReadonlyArray<GQLResolversTypes['Level']>, ParentType, ContextType>;
  newsletter: Resolver<Maybe<GQLResolversTypes['Newsletter']>, ParentType, ContextType, RequireFields<GQLQuerynewsletterArgs, 'id'>>;
  newsletters: Resolver<ReadonlyArray<GQLResolversTypes['Newsletter']>, ParentType, ContextType>;
  newslettersActive: Resolver<ReadonlyArray<GQLResolversTypes['Newsletter']>, ParentType, ContextType>;
  occLogin: Resolver<GQLResolversTypes['OccResult'], ParentType, ContextType>;
  overallClassCompletedActivities: Resolver<Maybe<GQLResolversTypes['OverallClassCompletedActivities']>, ParentType, ContextType, RequireFields<GQLQueryoverallClassCompletedActivitiesArgs, 'classId'>>;
  progressStudents: Resolver<GQLResolversTypes['ProgressStudent'], ParentType, ContextType, RequireFields<GQLQueryprogressStudentsArgs, 'data'>>;
  teacherClasses: Resolver<ReadonlyArray<GQLResolversTypes['TeacherClass']>, ParentType, ContextType, RequireFields<GQLQueryteacherClassesArgs, 'data'>>;
  teacherClassesActivated: Resolver<ReadonlyArray<GQLResolversTypes['TeacherClassesActivated']>, ParentType, ContextType>;
  theme: Resolver<Maybe<GQLResolversTypes['Theme']>, ParentType, ContextType, RequireFields<GQLQuerythemeArgs, 'id'>>;
  themeTotal: Resolver<Maybe<ReadonlyArray<GQLResolversTypes['ThemeTotal']>>, ParentType, ContextType, RequireFields<GQLQuerythemeTotalArgs, 'classId'>>;
  themes: Resolver<ReadonlyArray<GQLResolversTypes['Theme']>, ParentType, ContextType>;
  user: Resolver<Maybe<ReadonlyArray<GQLResolversTypes['User']>>, ParentType, ContextType, RequireFields<GQLQueryuserArgs, never>>;
  userRole: Resolver<Maybe<GQLResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<GQLQueryuserRoleArgs, 'id'>>;
  userRoles: Resolver<ReadonlyArray<GQLResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<GQLQueryuserRolesArgs, never>>;
  viewerEnrollmentLevelCodes: Resolver<ReadonlyArray<GQLResolversTypes['LevelCode']>, ParentType, ContextType, RequireFields<GQLQueryviewerEnrollmentLevelCodesArgs, never>>;
  viewerTeacherClasses: Resolver<ReadonlyArray<GQLResolversTypes['TeacherClass']>, ParentType, ContextType>;
  viewerTeacherLevelCodes: Resolver<ReadonlyArray<GQLResolversTypes['LevelCode']>, ParentType, ContextType, RequireFields<GQLQueryviewerTeacherLevelCodesArgs, never>>;
};

export type GQLActivitiesListByProgressOrderResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivitiesListByProgressOrder'] = GQLResolversParentTypes['ActivitiesListByProgressOrder']> = {
  partId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  activityId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  cycleOrder: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLClassResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Class'] = GQLResolversParentTypes['Class']> = {
  campusId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  carrerId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  endDate: Resolver<Maybe<GQLResolversTypes['DateTime']>, ParentType, ContextType>;
  hasActivated: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  hasEcampus: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  hasEyoung: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  institutionId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  levelCode: Resolver<GQLResolversTypes['LevelCode'], ParentType, ContextType>;
  levelCodeId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  localId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  periodId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  regionalId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  sessionId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  startDate: Resolver<Maybe<GQLResolversTypes['DateTime']>, ParentType, ContextType>;
  studentGrades: Resolver<ReadonlyArray<GQLResolversTypes['ClassStudentGrade']>, ParentType, ContextType, RequireFields<GQLClassstudentGradesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLUserResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['User'] = GQLResolversParentTypes['User']> = {
  accountId: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  avatar: Resolver<Maybe<GQLResolversTypes['Avatar']>, ParentType, ContextType>;
  avatarId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  defaultLevelTypeId: Resolver<GQLResolversTypes['LevelTypeId'], ParentType, ContextType>;
  hasEcampus: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  hasEyoung: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  initials: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  isAdult: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  isTeacher: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  macId: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  macPass: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  materials: Resolver<Maybe<ReadonlyArray<Maybe<GQLResolversTypes['Material']>>>, ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  onboarded: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  roles: Resolver<ReadonlyArray<GQLResolversTypes['Role']>, ParentType, ContextType>;
  studentLevel: Resolver<GQLResolversTypes['studentLevel'], ParentType, ContextType>;
  teacherClasses: Resolver<ReadonlyArray<GQLResolversTypes['TeacherClass']>, ParentType, ContextType>;
  totalAvailableActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  totalCompletedActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType, RequireFields<GQLUsertotalCompletedActivitiesArgs, never>>;
  totalProgressChecksCompletedForClass: Resolver<GQLResolversTypes['Int'], ParentType, ContextType, RequireFields<GQLUsertotalProgressChecksCompletedForClassArgs, 'classId'>>;
  userInterest: Resolver<ReadonlyArray<GQLResolversTypes['UserInterest']>, ParentType, ContextType>;
  userRoles: Resolver<ReadonlyArray<GQLResolversTypes['UserRole']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLActivityTypeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityType'] = GQLResolversParentTypes['ActivityType']> = {
  id: Resolver<GQLResolversTypes['ActivityTypeId'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLEmbeddedActivityResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['EmbeddedActivity'] = GQLResolversParentTypes['EmbeddedActivity']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  typeId: Resolver<GQLResolversTypes['ActivityTypeId'], ParentType, ContextType>;
  type: Resolver<GQLResolversTypes['ActivityType'], ParentType, ContextType>;
  data: Resolver<GQLResolversTypes['EmbeddedActivityData'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  estimatedTime: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLHtmlActivityResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['HtmlActivity'] = GQLResolversParentTypes['HtmlActivity']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  typeId: Resolver<GQLResolversTypes['ActivityTypeId'], ParentType, ContextType>;
  type: Resolver<GQLResolversTypes['ActivityType'], ParentType, ContextType>;
  data: Resolver<GQLResolversTypes['HtmlActivityData'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  estimatedTime: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLActivityUnionResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityUnion'] = GQLResolversParentTypes['ActivityUnion']> = {
  __resolveType: TypeResolveFn<'EmbeddedActivity' | 'HtmlActivity', ParentType, ContextType>;
};

export type GQLClassStudentGradeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ClassStudentGrade'] = GQLResolversParentTypes['ClassStudentGrade']> = {
  studentId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  totalActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  totalProgressChecks: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  completedActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  completedProgressChecks: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  completionGrade: Resolver<GQLResolversTypes['Float'], ParentType, ContextType>;
  progressCheckGrade: Resolver<GQLResolversTypes['Float'], ParentType, ContextType>;
  grades: Resolver<ReadonlyArray<GQLResolversTypes['StudentGrade']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLStudentGradeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['StudentGrade'] = GQLResolversParentTypes['StudentGrade']> = {
  typeId: Resolver<GQLResolversTypes['GradeTypeId'], ParentType, ContextType>;
  grade: Resolver<GQLResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLPermissionIdResolvers = EnumResolverSignature<{ MANAGE_LEVEL: any, MANAGE_THEME: any, MANAGE_CYCLE: any, MANAGE_ACTIVITY: any, EXECUTE_ACTIVITY: any, MANAGE_COMMENTS: any, MANAGE_CLASS: any, MANAGE_CHALLENGE: any, MANAGE_NEWSLETTER: any, MANAGE_MASTER: any, HORIZON_ONE: any, CHAT_ETUTOR: any, COURSES_ETUTOR: any, MY_QUESTIONS: any }, GQLResolversTypes['PermissionId']>;

export type GQLRoleIdResolvers = EnumResolverSignature<{ MASTER: any, ADMIN: any, STUDENT: any, TEACHER: any, GUARDIAN: any, HORIZON_ONE: any, E_TUTOR: any }, GQLResolversTypes['RoleId']>;

export type GQLPermissionResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Permission'] = GQLResolversParentTypes['Permission']> = {
  id: Resolver<GQLResolversTypes['PermissionId'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLRoleResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Role'] = GQLResolversParentTypes['Role']> = {
  id: Resolver<GQLResolversTypes['RoleId'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  permissions: Resolver<ReadonlyArray<GQLResolversTypes['Permission']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLViewerChangeAvatarMutationErrorResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ViewerChangeAvatarMutationError'] = GQLResolversParentTypes['ViewerChangeAvatarMutationError']> = {
  message: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLViewerChangeAvatarMutationResultResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ViewerChangeAvatarMutationResult'] = GQLResolversParentTypes['ViewerChangeAvatarMutationResult']> = {
  __resolveType: TypeResolveFn<'User' | 'ViewerChangeAvatarMutationError', ParentType, ContextType>;
};

export type GQLOccResultResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['OccResult'] = GQLResolversParentTypes['OccResult']> = {
  tokenSaml: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  urlSubmit: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLCycleResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Cycle'] = GQLResolversParentTypes['Cycle']> = {
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  activities: Resolver<ReadonlyArray<GQLResolversTypes['CycleActivity']>, ParentType, ContextType>;
  classOverallCompletion: Resolver<GQLResolversTypes['Float'], ParentType, ContextType, RequireFields<GQLCycleclassOverallCompletionArgs, 'classId'>>;
  classOverallCompletionRatio: Resolver<GQLResolversTypes['Float'], ParentType, ContextType, RequireFields<GQLCycleclassOverallCompletionRatioArgs, 'classId'>>;
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  levelTheme: Resolver<GQLResolversTypes['LevelTheme'], ParentType, ContextType>;
  levelThemeId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  order: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  studentHasCompleted: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType, RequireFields<GQLCyclestudentHasCompletedArgs, 'studentId'>>;
  totalActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  viewerHasCompleted: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLLevelThemeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['LevelTheme'] = GQLResolversParentTypes['LevelTheme']> = {
  classOverallCompletion: Resolver<GQLResolversTypes['Float'], ParentType, ContextType, RequireFields<GQLLevelThemeclassOverallCompletionArgs, 'classId'>>;
  classOverallCompletionRatio: Resolver<GQLResolversTypes['Float'], ParentType, ContextType, RequireFields<GQLLevelThemeclassOverallCompletionRatioArgs, 'classId'>>;
  cycles: Resolver<ReadonlyArray<GQLResolversTypes['Cycle']>, ParentType, ContextType>;
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  level: Resolver<GQLResolversTypes['Level'], ParentType, ContextType>;
  levelId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  order: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  studentTotalCompletedActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType, RequireFields<GQLLevelThemestudentTotalCompletedActivitiesArgs, 'studentId'>>;
  theme: Resolver<GQLResolversTypes['Theme'], ParentType, ContextType>;
  themeId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  totalActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  totalCycles: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  viewerTotalCompletedActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLOverallClassCompletedActivitiesResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['OverallClassCompletedActivities'] = GQLResolversParentTypes['OverallClassCompletedActivities']> = {
  classId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  totalActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  completedActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  totalStudents: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  overallCompletion: Resolver<GQLResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLProgressStudentResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ProgressStudent'] = GQLResolversParentTypes['ProgressStudent']> = {
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  totalActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  totalActivitiesCompleted: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLLevelCodeItemResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['LevelCodeItem'] = GQLResolversParentTypes['LevelCodeItem']> = {
  levelId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLClassItemResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ClassItem'] = GQLResolversParentTypes['ClassItem']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  levelCode: Resolver<GQLResolversTypes['LevelCodeItem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLTeacherClassesActivatedResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['TeacherClassesActivated'] = GQLResolversParentTypes['TeacherClassesActivated']> = {
  code: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  class: Resolver<Maybe<GQLResolversTypes['ClassItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLThemeTotalResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ThemeTotal'] = GQLResolversParentTypes['ThemeTotal']> = {
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  total: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  totalCompleted: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLActivityDataResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityData'] = GQLResolversParentTypes['ActivityData']> = {
  __resolveType: TypeResolveFn<'EmbeddedActivityData' | 'HtmlActivityData', ParentType, ContextType>;
  activityId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
};

export type GQLActivityTimerResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityTimer'] = GQLResolversParentTypes['ActivityTimer']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  cycleActivityId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  startTime: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  completionTime: Resolver<Maybe<GQLResolversTypes['DateTime']>, ParentType, ContextType>;
  completed: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  classId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  cycleActivity: Resolver<GQLResolversTypes['CycleActivity'], ParentType, ContextType>;
  currentUser: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLEmbeddedActivityDataResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['EmbeddedActivityData'] = GQLResolversParentTypes['EmbeddedActivityData']> = {
  activityId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  url: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  height: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLHtmlActivityDataResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['HtmlActivityData'] = GQLResolversParentTypes['HtmlActivityData']> = {
  activityId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  html: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLActivityResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Activity'] = GQLResolversParentTypes['Activity']> = {
  __resolveType: TypeResolveFn<'EmbeddedActivity' | 'HtmlActivity', ParentType, ContextType>;
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  typeId: Resolver<GQLResolversTypes['ActivityTypeId'], ParentType, ContextType>;
  type: Resolver<GQLResolversTypes['ActivityType'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  estimatedTime: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
};

export type GQLAnnotationResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Annotation'] = GQLResolversParentTypes['Annotation']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  meetingId: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  createdDate: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  updatedDate: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  data: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLAvatarResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Avatar'] = GQLResolversParentTypes['Avatar']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  extension: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  thumbnailUrl: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  listUrl: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLBackupResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Backup'] = GQLResolversParentTypes['Backup']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  type: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  data: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLCampusResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Campus'] = GQLResolversParentTypes['Campus']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  regionalId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLCarrerResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Carrer'] = GQLResolversParentTypes['Carrer']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  carrerId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  permissions: Resolver<Maybe<ReadonlyArray<Maybe<GQLResolversTypes['CarrerPermission']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLChallengeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Challenge'] = GQLResolversParentTypes['Challenge']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  text: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  startAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  endAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLChatMessageResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ChatMessage'] = GQLResolversParentTypes['ChatMessage']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  isEtutor: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  levelCodeId: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  levelCodeName: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  levelThemeId: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  levelThemeName: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  cycleActivityId: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  cycleActivityName: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  activityName: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  message: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  createdAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  user: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLChatResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Chat'] = GQLResolversParentTypes['Chat']> = {
  userId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  firstMessage: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  dateMessage: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  amountMessage: Resolver<Maybe<GQLResolversTypes['Int']>, ParentType, ContextType>;
  isRead: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  updatedAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  createdAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  user: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  levelCode: Resolver<ReadonlyArray<Maybe<GQLResolversTypes['LevelCode']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLActivityCommentResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ActivityComment'] = GQLResolversParentTypes['ActivityComment']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  text: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  parentId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  activityId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  classId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  replies: Resolver<ReadonlyArray<GQLResolversTypes['ActivityComment']>, ParentType, ContextType>;
  user: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  createdAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  viewerCanDelete: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  viewerCanEdit: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  parent: Resolver<Maybe<GQLResolversTypes['ActivityComment']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLCommentResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Comment'] = GQLResolversParentTypes['Comment']> = {
  __resolveType: TypeResolveFn<'ActivityComment', ParentType, ContextType>;
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  text: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  parentId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  createdAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
};

export type GQLCountResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Count'] = GQLResolversParentTypes['Count']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  count: Resolver<Maybe<GQLResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLCycleActivityResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['CycleActivity'] = GQLResolversParentTypes['CycleActivity']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  cycleId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  activityId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  order: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  cycle: Resolver<GQLResolversTypes['Cycle'], ParentType, ContextType>;
  activity: Resolver<GQLResolversTypes['ActivityUnion'], ParentType, ContextType>;
  nextActivity: Resolver<Maybe<GQLResolversTypes['CycleActivity']>, ParentType, ContextType>;
  previousActivity: Resolver<Maybe<GQLResolversTypes['CycleActivity']>, ParentType, ContextType>;
  viewerHasCompleted: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  studentHasCompleted: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType, RequireFields<GQLCycleActivitystudentHasCompletedArgs, 'studentId'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLEnrollmentClassResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['EnrollmentClass'] = GQLResolversParentTypes['EnrollmentClass']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  enrollmentId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  classId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  class: Resolver<GQLResolversTypes['Class'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLEnrollmentResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Enrollment'] = GQLResolversParentTypes['Enrollment']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  levelCodeId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  levelCode: Resolver<GQLResolversTypes['LevelCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLInterestResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Interest'] = GQLResolversParentTypes['Interest']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLLevelCodeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['LevelCode'] = GQLResolversParentTypes['LevelCode']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  code: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  levelId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  level: Resolver<Maybe<GQLResolversTypes['Level']>, ParentType, ContextType>;
  learningMore: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  viewerTeacherClasses: Resolver<ReadonlyArray<GQLResolversTypes['TeacherClass']>, ParentType, ContextType, RequireFields<GQLLevelCodeviewerTeacherClassesArgs, never>>;
  viewerClasses: Resolver<ReadonlyArray<GQLResolversTypes['Class']>, ParentType, ContextType, RequireFields<GQLLevelCodeviewerClassesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLLevelResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Level'] = GQLResolversParentTypes['Level']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  order: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  typeId: Resolver<GQLResolversTypes['LevelTypeId'], ParentType, ContextType>;
  levelThemes: Resolver<ReadonlyArray<GQLResolversTypes['LevelTheme']>, ParentType, ContextType>;
  codes: Resolver<ReadonlyArray<GQLResolversTypes['LevelCode']>, ParentType, ContextType>;
  viewerClasses: Resolver<ReadonlyArray<GQLResolversTypes['EnrollmentClass']>, ParentType, ContextType>;
  totalActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  viewerTotalCompletedActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  viewerNextUnfinishedActivity: Resolver<Maybe<GQLResolversTypes['CycleActivity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLLocalResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Local'] = GQLResolversParentTypes['Local']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  campusId: Resolver<Maybe<GQLResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLLogResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Log'] = GQLResolversParentTypes['Log']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  body: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  key: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLMaterialResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Material'] = GQLResolversParentTypes['Material']> = {
  id: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  classId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  isbn: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  author: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  publisher: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  coverImg: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  isInternal: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  acquiredLanguageBooster: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  languageBank: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  contextId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  materialClass: Resolver<GQLResolversTypes['Class'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLMeetingResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Meeting'] = GQLResolversParentTypes['Meeting']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  date: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  objetive: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  startHour: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  endHour: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  classId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  attendTmpltNbr: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  facilityId: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  enabled: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  teacherName: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  courseName: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  teacherNotes: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  homework: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLNewsletterResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Newsletter'] = GQLResolversParentTypes['Newsletter']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  imgSrc: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  linkUrl: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLCarrerPermissionResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['CarrerPermission'] = GQLResolversParentTypes['CarrerPermission']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  carrerId: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  carrer: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  active: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLRegionalResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Regional'] = GQLResolversParentTypes['Regional']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLTeacherClassResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['TeacherClass'] = GQLResolversParentTypes['TeacherClass']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  teacherId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  classId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  class: Resolver<GQLResolversTypes['Class'], ParentType, ContextType>;
  teacher: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLThemeIconResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['ThemeIcon'] = GQLResolversParentTypes['ThemeIcon']> = {
  themeId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  content: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLThemeResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['Theme'] = GQLResolversParentTypes['Theme']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  active: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>;
  startColor: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  endColor: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  icon: Resolver<GQLResolversTypes['ThemeIcon'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLUserInterestResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['UserInterest'] = GQLResolversParentTypes['UserInterest']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  order: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  interestId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  interest: Resolver<GQLResolversTypes['Interest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLUserRoleResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['UserRole'] = GQLResolversParentTypes['UserRole']> = {
  id: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  userId: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  roleId: Resolver<GQLResolversTypes['RoleId'], ParentType, ContextType>;
  user: Resolver<GQLResolversTypes['User'], ParentType, ContextType>;
  role: Resolver<GQLResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLstudentLevelResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['studentLevel'] = GQLResolversParentTypes['studentLevel']> = {
  totalCompletedActivities: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GQLDateTimeScalarConfig extends GraphQLScalarTypeConfig<GQLResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GQLGenericErrorResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['GenericError'] = GQLResolversParentTypes['GenericError']> = {
  __resolveType: TypeResolveFn<'ViewerChangeAvatarMutationError' | 'SimpleError', ParentType, ContextType>;
  message: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
};

export type GQLSimpleErrorResolvers<ContextType = GraphQLContext, ParentType extends GQLResolversParentTypes['SimpleError'] = GQLResolversParentTypes['SimpleError']> = {
  message: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLResolvers<ContextType = GraphQLContext> = {
  ActivityTypeId: GQLActivityTypeIdResolvers;
  GradeTypeId: GQLGradeTypeIdResolvers;
  LevelTypeId: GQLLevelTypeIdResolvers;
  Mutation: GQLMutationResolvers<ContextType>;
  CompleteActivityResult: GQLCompleteActivityResultResolvers<ContextType>;
  CreateCommentOnActivityResult: GQLCreateCommentOnActivityResultResolvers<ContextType>;
  DeleteActivityCommentSuccessResult: GQLDeleteActivityCommentSuccessResultResolvers<ContextType>;
  DeleteActivityCommentResult: GQLDeleteActivityCommentResultResolvers<ContextType>;
  StartActivityResult: GQLStartActivityResultResolvers<ContextType>;
  Query: GQLQueryResolvers<ContextType>;
  ActivitiesListByProgressOrder: GQLActivitiesListByProgressOrderResolvers<ContextType>;
  Class: GQLClassResolvers<ContextType>;
  User: GQLUserResolvers<ContextType>;
  ActivityType: GQLActivityTypeResolvers<ContextType>;
  EmbeddedActivity: GQLEmbeddedActivityResolvers<ContextType>;
  HtmlActivity: GQLHtmlActivityResolvers<ContextType>;
  ActivityUnion: GQLActivityUnionResolvers<ContextType>;
  ClassStudentGrade: GQLClassStudentGradeResolvers<ContextType>;
  StudentGrade: GQLStudentGradeResolvers<ContextType>;
  PermissionId: GQLPermissionIdResolvers;
  RoleId: GQLRoleIdResolvers;
  Permission: GQLPermissionResolvers<ContextType>;
  Role: GQLRoleResolvers<ContextType>;
  ViewerChangeAvatarMutationError: GQLViewerChangeAvatarMutationErrorResolvers<ContextType>;
  ViewerChangeAvatarMutationResult: GQLViewerChangeAvatarMutationResultResolvers<ContextType>;
  OccResult: GQLOccResultResolvers<ContextType>;
  Cycle: GQLCycleResolvers<ContextType>;
  LevelTheme: GQLLevelThemeResolvers<ContextType>;
  OverallClassCompletedActivities: GQLOverallClassCompletedActivitiesResolvers<ContextType>;
  ProgressStudent: GQLProgressStudentResolvers<ContextType>;
  LevelCodeItem: GQLLevelCodeItemResolvers<ContextType>;
  ClassItem: GQLClassItemResolvers<ContextType>;
  TeacherClassesActivated: GQLTeacherClassesActivatedResolvers<ContextType>;
  ThemeTotal: GQLThemeTotalResolvers<ContextType>;
  ActivityData: GQLActivityDataResolvers<ContextType>;
  ActivityTimer: GQLActivityTimerResolvers<ContextType>;
  EmbeddedActivityData: GQLEmbeddedActivityDataResolvers<ContextType>;
  HtmlActivityData: GQLHtmlActivityDataResolvers<ContextType>;
  Activity: GQLActivityResolvers<ContextType>;
  Annotation: GQLAnnotationResolvers<ContextType>;
  Avatar: GQLAvatarResolvers<ContextType>;
  Backup: GQLBackupResolvers<ContextType>;
  Campus: GQLCampusResolvers<ContextType>;
  Carrer: GQLCarrerResolvers<ContextType>;
  Challenge: GQLChallengeResolvers<ContextType>;
  ChatMessage: GQLChatMessageResolvers<ContextType>;
  Chat: GQLChatResolvers<ContextType>;
  ActivityComment: GQLActivityCommentResolvers<ContextType>;
  Comment: GQLCommentResolvers<ContextType>;
  Count: GQLCountResolvers<ContextType>;
  CycleActivity: GQLCycleActivityResolvers<ContextType>;
  EnrollmentClass: GQLEnrollmentClassResolvers<ContextType>;
  Enrollment: GQLEnrollmentResolvers<ContextType>;
  Interest: GQLInterestResolvers<ContextType>;
  LevelCode: GQLLevelCodeResolvers<ContextType>;
  Level: GQLLevelResolvers<ContextType>;
  Local: GQLLocalResolvers<ContextType>;
  Log: GQLLogResolvers<ContextType>;
  Material: GQLMaterialResolvers<ContextType>;
  Meeting: GQLMeetingResolvers<ContextType>;
  Newsletter: GQLNewsletterResolvers<ContextType>;
  CarrerPermission: GQLCarrerPermissionResolvers<ContextType>;
  Regional: GQLRegionalResolvers<ContextType>;
  TeacherClass: GQLTeacherClassResolvers<ContextType>;
  ThemeIcon: GQLThemeIconResolvers<ContextType>;
  Theme: GQLThemeResolvers<ContextType>;
  UserInterest: GQLUserInterestResolvers<ContextType>;
  UserRole: GQLUserRoleResolvers<ContextType>;
  studentLevel: GQLstudentLevelResolvers<ContextType>;
  DateTime: GraphQLScalarType;
  GenericError: GQLGenericErrorResolvers<ContextType>;
  SimpleError: GQLSimpleErrorResolvers<ContextType>;
};


