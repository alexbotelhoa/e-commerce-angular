module.exports = {
  client: {
    service: {
      name: "ci",
      url: "http://localhost:3000/graphql"
    },
    excludes: ['/src/**/*.generated.ts']
  }
};
