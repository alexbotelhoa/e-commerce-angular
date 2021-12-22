import axios from 'axios';

interface KanttumRequestPromise {
  urlRedirect: string;
}

interface KanttumResponseData {
  attributes: {
    access_token: string,
  }
}

export async function kanttumFactory(userName: string, userEmail: string): Promise<KanttumRequestPromise | undefined> {
  try {
    // const authenticationEndpoint = 'https://api.kanttum.com/public/integracao_ci/access-token';
    // const response = await axios.post<KanttumResponseData>(authenticationEndpoint, {
    //   headers: {
    //       'AppId': 'cyf5BL577ByYGkhdQ7kynLRL',
    //       'ApiKey': 'c8HZU45L1gVCM3B29QJYfL2F',
    //       'Content-Type': 'application/vnd.api+json',
    //   },
    //   data: {
    //     attributes: {
    //       name: userName,
    //       email: userEmail
    //     }
    //   },
    //   responseType: 'json',
    // });

    // console.log("responseKanttum: ", response)

    const subdomain = 'cisp';
    
    // Teste previsto para 10/01/2022
    
    // Token dinâmico depois da integração
    // const accessToken = response.data.attributes.access_token;
    
    // Token fixo para teste
    const accessToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJ0aWQiOiJiMDJhMjY4Zi1mZDU4LTRiYWUtODYzOS03MWJlYWNmYmVkZTEiLCJuYW1lIjoiSm_Do28gU2lsdmEiLCJpYXQiOjE2Mzg4ODgzODcsImV4cCI6MTYzODg5MjAxMH0.Q0276IPBio4hKniGyojSGZJDNrcrqU7AQxDBWSMp0Z8';
    
    const redirect = '/processes/all';
    const urlFull = `https://${subdomain}.kanttum.com/sso?token=${accessToken}&redirect=${redirect}`;

    return { 
      urlRedirect: urlFull
    };
  } catch (e) {
    console.log("responseError: ", e);
    return undefined;
  }
}
