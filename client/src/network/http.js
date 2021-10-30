export default class HttpClient {
    // 자체적으로 공통적인 baseURL을 가지고 있다.
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    // 비동기적으로 처리하는 fetch API
    // URL, options 
    // 자체적으로는 브라우저 API에 있는 fetch API사용
    // 비동기적인 사고내에서 동기적으로 코드를 작성하려면... await 사용
    async fetch(url, options) {
        const response = await fetch(`${this.baseURL}${url}`, {
            // 사용자가 원하는 옵션들을 하나하나씩 풀어서 추가
            ...options,
            headers: {
                'Content-Type': 'application/json',
                // 사용자가 원하는 옵션들의 헤더에 추가적으로 있는 부분들 추가
                ...options.headers,
            }
        })
        // json()도 promise이므로 await 붙여준다.
        // body가 없는 response에 json을 붙이면 에러가 일어날 수 있으므로
        // 이 부분을 try/catch로 감싸준다.
        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error(error);
        }

        // response의 상태코드가 200대가 아니라면 
        if (response.status > 299 || response.status < 200) {
            const message = data && data.message ? data.message : 'Something went wrong! 😭'
            throw new Error(message);
        }
        return data;
    }
}