import { DatabaseService } from '../../../shared/services/database.service';
import { hmacsign } from './bundle';
import { getUserById } from "../../../shared/repositories/user.repository";
import { getLevelById } from "../../../shared/repositories/level.repository";


export interface ILtiParams {
  lti_message_type: string;
  lti_version: string;
  resource_link_id: string;
  oauth_signature?: any;
  oauth_consumer_key: string;
  oauth_consumer_secret: string;
  oauth_signature_method: string;
  oauth_timestamp: number;
  oauth_version: string;
  oauth_nonce: string;
  oauth_callback: string;
  roles: string;
  user_id: string;
  lis_person_name_full: string;
  lis_person_contact_email_primary: string;
  lis_person_sourced_id: string;
  tool_consumer_instance_guid: string;
  tool_consumer_instance_description: string;
  context_id: string;
  context_title: string;
  context_label: string;
}

interface ILti {
  params: ILtiParams;
  action: string;
}

export async function ltiParamsFactory(KEY: string, db: DatabaseService, userId: string, levelId: number): Promise<ILti | undefined> {
  try {
    // vai ser usado quando fazer por aluno dinamicamente
    /*
    const user = await getUserById(db)(userId);
    const level = await getLevelById(db)(levelId);
  
    if (!user || !level || !user?.accountId) {
      return;
    }

    
    const LtiParamsPerUser: ILtiParams = {
      // LTI Required Parameters
      lti_message_type: 'basic-lti-launch-request', // fixo
      lti_version: 'LTI-1p0', // fixo
      resource_link_id: 'resourceLinkId', // fixo
      oauth_consumer_key: 'BLTI-250258', // fixo
      oauth_consumer_secret: KEY, // fixo
      oauth_signature_method: 'HMAC-SHA1', // fixo
      oauth_timestamp: timestamp,
      oauth_version: '1.0', // fixo
      oauth_nonce: btoa(timestamp.toString()),
      oauth_callback: 'about:blank', // fixo
      tool_consumer_instance_description: 'Associação Cultura Inglesa', // fixo
      roles: 'Student', // fixo para aluno
  
      user_id: user.id, // variável - id do aluno
      lis_person_name_full: user.name, // variável - fullname do aluno
      lis_person_contact_email_primary: user.accountId, // variável - email do aluno na CI
      lis_person_sourced_id: `culturainglesa.com.br:${user.accountId.split('@')[0]}`, //'culturainglesa.com.br:jonathan.gomes', // baseado no email do aluno
      tool_consumer_instance_guid: 'culturainglesa.com.br', // baseado no email do aluno
      context_id: level.id.toString(), // variável - id do nível da CI
      context_title: level.name, // variável - nome do nível da CI
      context_label: level.name // variável - nome do nível da CI
    };
   */

    const timestamp = Math.round(Date.now() / 1000);
    const ACTION = 'https://gateway.cengage.com/rest/launchBasicLTI/250258/60571325025811514707991834330/3719898';
    const METHOD = 'POST';

    const LtiParams: ILtiParams = {
      // LTI Required Parameters
      lti_message_type: 'basic-lti-launch-request', // fixo
      lti_version: 'LTI-1p0', // fixo
      resource_link_id: 'resourceLinkId', // fixo
      oauth_consumer_key: 'BLTI-250258', // fixo
      oauth_consumer_secret: KEY, // fixo
      oauth_signature_method: 'HMAC-SHA1', // fixo
      oauth_timestamp: timestamp,
      oauth_version: '1.0', // fixo
      oauth_nonce: Buffer.from(timestamp.toString()).toString('base64'),
      oauth_callback: 'about:blank', // fixo
      tool_consumer_instance_description: 'Associação Cultura Inglesa', // fixo
      roles: 'Student', // fixo para aluno
  
      user_id: '654321a', // variável - id do aluno
      lis_person_name_full: 'Jonathan Gomes', // variável - fullname do aluno
      lis_person_contact_email_primary: 'jonathan.gomes@culturainglesa.com.br', // variável - email do aluno na CI
      lis_person_sourced_id: 'culturainglesa.com.br:jonathan.gomes', // baseado no email do aluno
      tool_consumer_instance_guid: 'culturainglesa.com.br', // baseado no email do aluno
      context_id: '10004', // variável - id do nível da CI
      context_title: 'UPPER 1', // variável - nome do nível da CI
      context_label: 'UPPER 1' // variável - nome do nível da CI
    };
  
    LtiParams.oauth_signature = hmacsign(METHOD, ACTION, LtiParams, KEY);
  
    return { params: LtiParams, action: ACTION };
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
