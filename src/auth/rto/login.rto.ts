export class LoginRto {
    accessToken: string;
    refreshToken: string;

    constructor(partial: Partial<LoginRto>) {
        Object.assign(this, {
            success: true,
            statusCode: 200,
            data: partial,
        });
    }
}
