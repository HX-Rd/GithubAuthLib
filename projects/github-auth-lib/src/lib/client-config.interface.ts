export interface IClientConfig{
    redirectUrl: string;
    clientId: string;
    codeRedirectUrl: string;
    redirectAfterLogin?: string;
    redirectAfterLogout?: string;
    scopes?: string[];
}
