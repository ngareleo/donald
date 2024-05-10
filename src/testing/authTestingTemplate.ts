export const loginFlowTemplate = () => {
  let accessToken;
  let userId;
  let user = {
    email: "test@testaccount.com",
    password: "testPassword",
    username: "testUser0",
  };
  return {
    beforeAll() {
      console.log("Running before all tests");
    },
    afterAll() {
      console.log("Running after all tests");
    },
  };
};
