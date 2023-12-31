declare namespace NodeJS {
    interface ProcessEnv {
        PG_HOST: string;
        PG_PORT: string;
        PG_USER: string;
        PG_PASSWORD: string;
        PG_DATABASE: string;

        ACCESS_TOKEN: string;
        REFRESH_TOKEN: string;
    }
}
