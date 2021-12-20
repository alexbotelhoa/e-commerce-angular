import axios from 'axios';

interface KanttumRequestPromise {
  accessToken: string;
}

interface KanttumResponseData {
  access_token: string,
}

export async function kanttumFactory(userName: string, userEmail: string): Promise<KanttumRequestPromise | undefined> {
  try {
    const url = 'https://dev.api.kanttum.com/public/integracao_ci/access-token';
    const response = await axios.post<KanttumResponseData>(url, {
      headers: {
          'AppId': '',
          'ApiKey': '',
          'Content-Type': 'application/vnd.api+json',
      },
      data: {
        attributes: {
          name: userName,
          email: userEmail
        }
      },
      responseType: 'json',
    });

    console.log("responseOK: ", response)

    const ACTION = 'https://dev.api.kanttum.com/public/integracao_ci';
    return { 
      accessToken: ACTION
    };
  } catch (e) {
    console.log("responseError: ", e);    
    return undefined;
  }
}
