module.exports = {
    projects: {
        app: {
            schema: ["src/**/*.graphql"],
            extensions: {
                endpoints: {
                    default: {
                        url: "http://localhost:3000/graphql",
                    },
                },
            }
        },
    },
}
