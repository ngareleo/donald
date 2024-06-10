import {
  afterAll,
  beforeAll,
  beforeEach,
  describe as bunDescribe,
} from "bun:test";

const authTemplate = () => {
  let accessToken;
  let userId;
  let user = {
    email: "test@testaccount.com",
    password: "testPassword",
    username: "testUser0",
  };
  const pre = () => {};
  const post = () => {};
  const each = () => {};
  return {
    pre,
    post,
    each,
  };
};

const { pre, post, each } = authTemplate();

export const describe = (label: string, fn: () => void) => {
  bunDescribe(label, () => {
    beforeAll(pre);
    beforeEach(each);
    afterAll(post);
    fn();
  });
};
