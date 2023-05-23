import {isProduction} from 'helpers/isProduction'

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production App Engine URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
    const prodUrl = 'https://sopra-fs23-group-05-server.oa.r.appspot.com/'
    const devUrl = 'http://localhost:8080'

    return isProduction() ? prodUrl : devUrl
}

export const getWebSocketDomain = () => {
    const prodWebSocketUrl = 'wss://sopra-fs23-group-05-server.oa.r.appspot.com'
    const devWebSocketUrl = 'ws://localhost:8080'

    return isProduction() ? prodWebSocketUrl : devWebSocketUrl
}

export const getClientDomain = () => {
    const prodClientDomain = 'https://sopra-fs23-group-05-client.oa.r.appspot.com'
    const devClientDomain = 'http://localhost:3000'

    return isProduction() ? prodClientDomain : devClientDomain
}
